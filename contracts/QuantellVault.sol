// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title QuantellVault
 * @dev 一个简单的 USDC 收益金库合约 (Quantell Brand)
 * 
 * 功能：
 * - 用户存入 USDC，合约记录存款金额和时间
 * - 按年化收益率（APR）计算收益
 * - 用户可随时取出本金 + 累积收益
 * - 管理员可暂停存款、调整利率、补充奖励池
 * 
 * 注意：收益由管理员手动补充到合约中
 */
contract QuantellVault is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ============ 状态变量 ============

    /// @dev USDC 代币合约地址 (Arbitrum Mainnet)
    IERC20 public immutable usdc;
    
    /// @dev 年化收益率，以基点表示 (10000 = 100%, 1000 = 10%)
    uint256 public aprBasisPoints;
    
    /// @dev 每秒收益率 (基于 APR 计算)
    uint256 public ratePerSecond;
    
    /// @dev 最小存款金额 (6 decimals for USDC)
    uint256 public minDeposit;
    
    /// @dev 最大总存款金额
    uint256 public maxTotalDeposits;
    
    /// @dev 当前总存款金额
    uint256 public totalDeposits;

    /// @dev 用户存款信息
    struct UserInfo {
        uint256 depositAmount;      // 存款本金
        uint256 depositTimestamp;   // 存款时间
        uint256 lastClaimTimestamp; // 上次领取收益时间
        uint256 claimedRewards;     // 已领取的总收益
    }
    
    mapping(address => UserInfo) public userInfo;
    
    // ============ 事件 ============
    
    event Deposited(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 principal, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 rewards);
    event APRUpdated(uint256 oldAPR, uint256 newAPR);
    event RewardsAdded(uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    // ============ 构造函数 ============

    /**
     * @dev 初始化合约
     * @param _usdc USDC 代币地址
     * @param _aprBasisPoints 初始年化收益率 (基点，1000 = 10%)
     * @param _minDeposit 最小存款金额
     * @param _maxTotalDeposits 最大总存款金额
     */
    constructor(
        address _usdc,
        uint256 _aprBasisPoints,
        uint256 _minDeposit,
        uint256 _maxTotalDeposits
    ) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        
        usdc = IERC20(_usdc);
        aprBasisPoints = _aprBasisPoints;
        minDeposit = _minDeposit;
        maxTotalDeposits = _maxTotalDeposits;
        
        _updateRatePerSecond();
    }

    // ============ 用户函数 ============

    /**
     * @dev 存款 USDC
     * @param amount 存款金额 (6 decimals)
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount >= minDeposit, "Amount below minimum");
        require(totalDeposits + amount <= maxTotalDeposits, "Exceeds max deposits");
        
        UserInfo storage user = userInfo[msg.sender];
        
        // 如果用户已有存款，先领取之前的收益
        if (user.depositAmount > 0) {
            _claimRewards(msg.sender);
        }
        
        // 转入 USDC
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        
        // 更新用户信息
        user.depositAmount += amount;
        user.depositTimestamp = block.timestamp;
        user.lastClaimTimestamp = block.timestamp;
        
        // 更新总存款
        totalDeposits += amount;
        
        emit Deposited(msg.sender, amount, block.timestamp);
    }

    /**
     * @dev 取款：取出全部本金 + 累积收益
     */
    function withdraw() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        require(user.depositAmount > 0, "No deposit found");
        
        uint256 principal = user.depositAmount;
        uint256 pendingRewards = _calculatePendingRewards(msg.sender);
        uint256 totalAmount = principal + pendingRewards;
        
        // 检查合约余额是否足够
        require(usdc.balanceOf(address(this)) >= totalAmount, "Insufficient contract balance");
        
        // 更新状态
        user.depositAmount = 0;
        user.claimedRewards += pendingRewards;
        totalDeposits -= principal;
        
        // 转出代币
        usdc.safeTransfer(msg.sender, totalAmount);
        
        emit Withdrawn(msg.sender, principal, pendingRewards);
    }

    /**
     * @dev 仅领取收益（不取本金）
     */
    function claimRewards() external nonReentrant {
        _claimRewards(msg.sender);
    }

    // ============ 查询函数 ============

    /**
     * @dev 查询用户待领取的收益
     */
    function getPendingRewards(address account) external view returns (uint256) {
        return _calculatePendingRewards(account);
    }

    /**
     * @dev 查询用户总余额（本金 + 待领取收益）
     */
    function getBalance(address account) external view returns (uint256) {
        UserInfo memory user = userInfo[account];
        return user.depositAmount + _calculatePendingRewards(account);
    }

    /**
     * @dev 查询用户详细信息
     */
    function getUserInfo(address account) external view returns (
        uint256 depositAmount,
        uint256 depositTimestamp,
        uint256 pendingRewards,
        uint256 claimedRewards
    ) {
        UserInfo memory user = userInfo[account];
        return (
            user.depositAmount,
            user.depositTimestamp,
            _calculatePendingRewards(account),
            user.claimedRewards
        );
    }

    /**
     * @dev 查询合约奖励池余额（可用于支付收益的余额）
     */
    function getRewardsPoolBalance() external view returns (uint256) {
        uint256 contractBalance = usdc.balanceOf(address(this));
        if (contractBalance > totalDeposits) {
            return contractBalance - totalDeposits;
        }
        return 0;
    }

    // ============ 管理员函数 ============

    /**
     * @dev 更新年化收益率
     * @param newAPRBasisPoints 新的 APR (基点)
     */
    function setAPR(uint256 newAPRBasisPoints) external onlyOwner {
        require(newAPRBasisPoints <= 10000, "APR cannot exceed 100%");
        
        uint256 oldAPR = aprBasisPoints;
        aprBasisPoints = newAPRBasisPoints;
        _updateRatePerSecond();
        
        emit APRUpdated(oldAPR, newAPRBasisPoints);
    }

    /**
     * @dev 向奖励池添加 USDC（用于支付用户收益）
     * @param amount 添加的金额
     */
    function addRewards(uint256 amount) external onlyOwner {
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        emit RewardsAdded(amount);
    }

    /**
     * @dev 更新最小存款金额
     */
    function setMinDeposit(uint256 newMinDeposit) external onlyOwner {
        minDeposit = newMinDeposit;
    }

    /**
     * @dev 更新最大总存款金额
     */
    function setMaxTotalDeposits(uint256 newMaxTotalDeposits) external onlyOwner {
        maxTotalDeposits = newMaxTotalDeposits;
    }

    /**
     * @dev 暂停存款
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev 恢复存款
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev 紧急提取：管理员可提取奖励池中的闲置资金（不包括用户本金）
     */
    function emergencyWithdrawRewards() external onlyOwner {
        uint256 contractBalance = usdc.balanceOf(address(this));
        require(contractBalance > totalDeposits, "No excess funds");
        
        uint256 excessFunds = contractBalance - totalDeposits;
        usdc.safeTransfer(owner(), excessFunds);
        
        emit EmergencyWithdraw(owner(), excessFunds);
    }

    // ============ 内部函数 ============

    /**
     * @dev 计算用户待领取的收益
     */
    function _calculatePendingRewards(address account) internal view returns (uint256) {
        UserInfo memory user = userInfo[account];
        
        if (user.depositAmount == 0) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp - user.lastClaimTimestamp;
        
        // 收益 = 本金 * 每秒利率 * 经过时间 / 1e18
        uint256 rewards = (user.depositAmount * ratePerSecond * timeElapsed) / 1e18;
        
        return rewards;
    }

    /**
     * @dev 内部领取收益函数
     */
    function _claimRewards(address account) internal {
        UserInfo storage user = userInfo[account];
        
        uint256 pendingRewards = _calculatePendingRewards(account);
        
        if (pendingRewards > 0) {
            require(usdc.balanceOf(address(this)) >= pendingRewards, "Insufficient rewards in pool");
            
            user.lastClaimTimestamp = block.timestamp;
            user.claimedRewards += pendingRewards;
            
            usdc.safeTransfer(account, pendingRewards);
            
            emit RewardsClaimed(account, pendingRewards);
        }
    }

    /**
     * @dev 更新每秒收益率
     */
    function _updateRatePerSecond() internal {
        // ratePerSecond = APR / 365 days / 10000 (basis points)
        // 使用 1e18 精度
        ratePerSecond = (aprBasisPoints * 1e18) / (365 days * 10000);
    }
}

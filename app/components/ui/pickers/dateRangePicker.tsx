import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Popover } from "../popover/popover";
import { Calendar, CalendarProps } from "./date/calendar";
import { selectVariants } from "../select/selectPrimitive";
import { CalendarIcon } from "../icon/calendar";
import { CaretDownIcon } from "../icon/caretDown";
import type { SizeType } from "../helpers/sizeType";
import { format } from "date-fns";
import { DateRange, DayPickerRangeProps } from "react-day-picker";
import { useLocale } from "../locale";
export type DateRangePickerProps = {
  onChange?: (date: DateRange) => void;
  // selected: Date;
  placeholder?: string;
  value?: DateRange;
  initialValue?: DateRange;
  dateFormat?: string;
  size?: SizeType;
  className?: string;
  formatString?: string;
} & Omit<DayPickerRangeProps, "mode">;

const DEFAULT_DATE_FORMAT = "yyyy/MM/dd";

const DateRangePicker: FC<DateRangePickerProps> = (props) => {
  const {
    placeholder,
    dateFormat,
    onChange,
    value,
    initialValue,
    size,
    className,
    formatString = DEFAULT_DATE_FORMAT,
    ...calendarProps
  } = props;
  const [locale] = useLocale("picker");
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | null>(
    value || initialValue || null
  );

  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const update = useDebouncedCallback((width: number) => {
    setIsMobileView(width <= 768);
  }, 100);

  // Effect hook to listen to window resize events
  useEffect(() => {
    const handleResize = () => {
      update(window.innerWidth);
    };

    setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (
      value?.from &&
      value?.to &&
      dateRange?.from &&
      dateRange?.to &&
      !areDatesEqual(value as any, dateRange as any)
    )
      setDateRange(value);
  }, [value]);

  const { trigger } = selectVariants({ size, className });

  const formattedValue = useMemo(() => {
    // console.log("dateRange", dateRange);
    if (!dateRange || !dateRange.from || !dateRange.to) {
      return placeholder ?? locale.selectDate;
    }
    const arr = [];
    if (dateRange.from) arr.push(format(dateRange.from, formatString));
    if (dateRange.to) arr.push(format(dateRange.to, formatString));

    return `${arr.join(" - ")}`;
  }, [dateRange, placeholder, locale]);

  const onOpenChange = (nextOpen: boolean) => {
    // console.log(dateRange);
    if (
      typeof dateRange?.to === "undefined" &&
      typeof dateRange?.from !== "undefined"
    ) {
      setDateRange({
        ...dateRange,
        to: dateRange.from,
      });
    }
    if (!nextOpen && dateRange) {
      onChange?.(dateRange);
    }
    setOpen(nextOpen);
  };

  const onSelected = (range: DateRange, date: Date) => {
    if (dateRange?.from && dateRange?.to) {
      setDateRange({
        from: date,
      });
    } else {
      setDateRange(range);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={onOpenChange}
      contentProps={{
        className: "oui-w-auto oui-p-0",
        align: "start",
      }}
      content={
        <Calendar
          numberOfMonths={isMobileView ? 1 : 2}
          {...calendarProps}
          mode={"range"}
          // @ts-ignore
          selected={dateRange}
          // @ts-ignore
          onSelect={onSelected}
        />
      }
    >
      <button
        className={trigger({
          className: "oui-datepicker-trigger oui-group",
        })}
        style={{
          height: "30px",
        }}
      >
        <span className="oui-datepicker-trigger-icon oui-flex oui-items-center oui-justify-center">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Frame" clip-path="url(#clip0_2002_6582)">
            <path id="Vector" d="M14 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V3.33332C0 3.07068 0.0517315 2.81061 0.152241 2.56796C0.25275 2.3253 0.400069 2.10483 0.585786 1.91911C0.960859 1.54404 1.46957 1.33332 2 1.33332H4V0.666656C4.00003 0.489863 4.07028 0.32032 4.1953 0.195318C4.32032 0.0703154 4.48987 9.15527e-05 4.66667 9.15527e-05C4.84346 9.15527e-05 5.01301 0.0703154 5.13804 0.195318C5.26306 0.32032 5.33331 0.489863 5.33333 0.666656V1.33332H10.6667V0.666656C10.6667 0.489863 10.7369 0.32032 10.862 0.195318C10.987 0.0703154 11.1565 9.15527e-05 11.3333 9.15527e-05C11.5101 9.15527e-05 11.6797 0.0703154 11.8047 0.195318C11.9297 0.32032 12 0.489863 12 0.666656V1.33332H14C14.5304 1.33332 15.0391 1.54404 15.4142 1.91911C15.7893 2.29418 16 2.80289 16 3.33332V14C16 14.5304 15.7893 15.0391 15.4142 15.4142C15.0391 15.7893 14.5304 16 14 16ZM1.33333 6.03332V14C1.33333 14.1768 1.40357 14.3464 1.5286 14.4714C1.65362 14.5964 1.82319 14.6667 2 14.6667H14C14.1768 14.6667 14.3464 14.5964 14.4714 14.4714C14.5964 14.3464 14.6667 14.1768 14.6667 14V6.03332H1.33333ZM1.33333 4.69999H14.6667V3.33332C14.6667 3.15651 14.5964 2.98694 14.4714 2.86192C14.3464 2.73689 14.1768 2.66666 14 2.66666H12V3.33332C12 3.51012 11.9297 3.67966 11.8047 3.80466C11.6797 3.92966 11.5101 3.99989 11.3333 3.99989C11.1565 3.99989 10.987 3.92966 10.862 3.80466C10.7369 3.67966 10.6667 3.51012 10.6667 3.33332V2.66666H5.33333V3.33332C5.33331 3.51012 5.26306 3.67966 5.13804 3.80466C5.01301 3.92966 4.84346 3.99989 4.66667 3.99989C4.48987 3.99989 4.32032 3.92966 4.1953 3.80466C4.07028 3.67966 4.00003 3.51012 4 3.33332V2.66666H2C1.82319 2.66666 1.65362 2.73689 1.5286 2.86192C1.40357 2.98694 1.33333 3.15651 1.33333 3.33332V4.69999ZM7.13333 12.6267C6.96491 12.6261 6.80295 12.5618 6.68 12.4467L4.87333 10.7467C4.7481 10.6238 4.6761 10.4566 4.6728 10.2812C4.66951 10.1058 4.73518 9.93605 4.85571 9.80854C4.97624 9.68102 5.14199 9.6059 5.31733 9.59931C5.49266 9.59273 5.66358 9.65521 5.79333 9.77332L7.12667 11.0333L10.2 7.99999C10.3283 7.89161 10.4928 7.83565 10.6605 7.8433C10.8283 7.85094 10.987 7.92163 11.1049 8.04122C11.2228 8.16082 11.2913 8.32051 11.2965 8.48838C11.3018 8.65624 11.2435 8.81991 11.1333 8.94666L7.60667 12.4267C7.54492 12.4896 7.47129 12.5398 7.39004 12.5741C7.30879 12.6084 7.22154 12.6263 7.13333 12.6267Z" fill="#94969C"/>
            </g>
            <defs>
            <clipPath id="clip0_2002_6582">
            <rect width="16" height="16" fill="white"/>
            </clipPath>
            </defs>
          </svg>
        </span>
        <span>{formattedValue}</span>
        <CaretDownIcon
          size={12}
          className="oui-datepicker-trigger-arrow oui-text-inherit oui-transition-transform group-data-[state=open]:oui-rotate-180 group-data-[state=closed]:oui-rotate-0"
          opacity={1}
        />
      </button>
    </Popover>
  );
};

DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };

function useDebouncedCallback(callback: any, delay: number) {
  const timeoutRef = useRef<any | null>(null);

  const debouncedCallback = useCallback(
    (args: any) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(args);
      }, delay);
    },
    [callback, delay]
  );
  return debouncedCallback;
}

function areDatesEqual(
  date1: { from: Date; to: Date },
  date2: { from: Date; to: Date }
): boolean {
  const extractDateParts = (date: Date) => ({
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  });

  const from1 = extractDateParts(date1.from);
  const to1 = extractDateParts(date1.to);
  const from2 = extractDateParts(date2.from);
  const to2 = extractDateParts(date2.to);

  return (
    from1.year === from2.year &&
    from1.month === from2.month &&
    from1.day === from2.day &&
    to1.year === to2.year &&
    to1.month === to2.month &&
    to1.day === to2.day
  );
}

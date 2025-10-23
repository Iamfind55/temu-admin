const DatePicker = ({
  value,
  name,
  onChange,
  className,
  title,
  required,
  id,
}: {
  value?: string; // Date value should be a string in the format 'YYYY-MM-DDTHH:mm'
  name?: string | "select_name";
  onChange?: (e: any) => void;
  className?: string | "";
  title?: string;
  required?: boolean | false;
  id: string;
}) => {
  return (
    <div className="flex items-start justify-start flex-col select-none gap-2 w-full">
      <label className="text-base text-xs">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type="time" // Changed to 'datetime-local' for both date and time selection
        name={name}
        value={value} // Expecting the value in 'YYYY-MM-DDTHH:mm' format
        onChange={onChange}
        required={required}
        className={`h-9 text-xs p-2 rounded w-full border pr-[50px] focus:border-b_text focus:bg-white focus:ring-1 focus:ring-base text-b_text outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik ${className}`}
      />
    </div>
  );
};

export default DatePicker;

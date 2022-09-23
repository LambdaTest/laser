interface TProps {
  loading?: boolean;
  subTitle?: string;
  title: string;
  value: string;
}

export default function SummaryCard({ loading = false, subTitle, title, value }: TProps) {
  let content;
  if (loading) {
    content = (
      <div className="w-full">
        <div className="w-10/12 mb-12">
          <div className="placeholder-content"></div>
        </div>
        <div className="w-4/12">
          <div className="placeholder-content"></div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="w-full">
        <div className="text-size-12 text-black mb-8">{title}</div>
        <div className="flex items-end">
          <div className="text-size-22 font-bold text-black leading-none">{value}</div>
          {subTitle && <div className="text-size-10 text-tas-400 ml-4">{subTitle}</div>}
        </div>
      </div>
    );
  }

  return <div className="flex flex-1 items-center p-16 bg-white radius-3 mb-8">{content}</div>;
}

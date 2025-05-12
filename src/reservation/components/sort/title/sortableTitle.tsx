import { SortIcon } from "../icon/sortIcon";

export const SortableTitle = ({ title, sortedColumn }: { title: string, sortedColumn?: any }) => (
    <div className="flex items-center justify-between">
        {title}
        <SortIcon order={sortedColumn?.order} />
    </div>
);

import { HiMiniArrowUp, HiMiniArrowDown } from "react-icons/hi2";
import { CgSortAz } from "react-icons/cg";

export const SortIcon = ({ order }: { order?: string }) => {
    if (!order) return <CgSortAz size={20} />;
    return order === "ascend" ? <HiMiniArrowUp size={16} /> : <HiMiniArrowDown size={16} />;
};

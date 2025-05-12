export const formatDate = (dateArray: any[]) => {
    if (!dateArray || dateArray.length !== 3) return "Invalid Date";
    return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).toLocaleDateString();
};

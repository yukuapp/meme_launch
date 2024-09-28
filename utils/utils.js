function pageDiv(all_count, limit) {
    return (all_count == 0 ? 0 : (all_count < limit ? 1 : Math.ceil(all_count / limit)));
}

function covertTimestampToDateTime(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toISOString();
    return formattedDate;
}
module.exports = {pageDiv,covertTimestampToDateTime};
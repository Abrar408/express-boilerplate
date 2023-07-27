const convertStringToArray = (string) => {
    const trimmedString = string?.trim();
    const array = trimmedString.split(",");

    return array;
}

module.exports = convertStringToArray;

const hasPassedThirtyDays = (date) => {
  const givenDate = new Date(date);
  const difference = Date.now() - givenDate.getTime();
  const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24));

  return daysPassed >= 30;
};

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

module.exports = {
  hasPassedThirtyDays,
  isToday,
};

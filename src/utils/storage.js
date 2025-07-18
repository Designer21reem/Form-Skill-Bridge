const SURVEY_DATA_KEY = 'survey-results';

export const saveSurveyData = (data) => {
  const existingData = JSON.parse(localStorage.getItem(SURVEY_DATA_KEY) || '[]');
  const newData = [...existingData, data];
  localStorage.setItem(SURVEY_DATA_KEY, JSON.stringify(newData));
};

export const getSurveyData = () => {
  return JSON.parse(localStorage.getItem(SURVEY_DATA_KEY) || '[]');
};

export const clearSurveyData = () => {
  localStorage.removeItem(SURVEY_DATA_KEY);
};
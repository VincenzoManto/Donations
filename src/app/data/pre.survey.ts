export const PreSurvey = {
  logoPosition: "right",
  completedHtml: "<h3>Now start playing!</h3>",

  pages: [
    {
      name: "intro",
      elements: [
        {
          type: "string",
          name: "refer",
          visibleIf: "false",
          title: "Referer",
          analytics: true
        },
        {
          type: "html",
          name: "introduction",
          html: `<p><h3>Introduction to this game</h3>

Hello and welcome to our study! You’ll play a simple game.

<h6>Privacy and data sharing</h6>
Some of the game choice you make <b>may be shared publicly</b> in aggregated, anonymous or personally identifiable form for research purposes. The results will be used solely for academic purposes and published in compliance with deontological ethics.

We sincerely thank you for your time and valuable contribution. Should you have any questions or require further information, please do not hesitate to contact us.</p>`,
        },
        {
          type: "checkbox",
          name: "tos",
          choices: [
            {
              value: "confirmed",
              text: "I confirm that I have read and understood the information provided above.",
            },
          ],
          title:
            "By participating, you agree to allow us to use your anonymized data for research. You can leave the study at any time without penalty.",
          isRequired: true,
        },
      ],
    },
    {
      name: "demographics",
      elements: [

        {
          type: "dropdown",
          name: "age_group",
          analytics: true,
          title: "Select your age group:",
          isRequired: true,
          choices: [
            { value: "18_25", text: "18-25" },
            { value: "26_35", text: "26-35" },
            { value: "36_45", text: "36-45" },
            { value: "46_60", text: "46-60" },
            { value: "60_plus", text: "Over 60" },
          ],
        },
        {
          type: "radiogroup",
          name: "gender",
          analytics: true,

          title: "What is your gender?",
          isRequired: true,
          choices: [
            { value: "male", text: "Male" },
            { value: "female", text: "Female" },
            { value: "prefer_not_to_say", text: "Prefer not to say" },
          ],
        },
        {
          type: "dropdown",
          name: "education",
          analytics: true,
          title: "What is your highest level of education?",
          isRequired: true,
          choices: [
            { value: "no_degree", text: "No degree" },
            { value: "high_school", text: "High School Diploma" },
            { value: "bachelor", text: "Bachelor's Degree" },
            { value: "master", text: "Master's Degree" },
            { value: "doctorate", text: "Doctorate" },
          ],
        },
        {
          type: "dropdown",
          name: "employment_status",
          analytics: true,

          title: "What is your current employment status?",
          isRequired: true,
          choices: [
            { value: "unemployed", text: "Unemployed" },
            { value: "student", text: "Student" },
            { value: "working-student", text: "Working student" },
            { value: "employed", text: "Employed" },
            { value: "retired", text: "Retired" },
          ],
        },
        {
          type: "dropdown",
          visibleIf: "{employment_status}='employed'",
          name: "income",
          analytics: true,
          title: "What is your monthly income?",
          choices: [
            { value: "0_500", text: "0-500" },
            { value: "501_1000", text: "501-1000" },
            { value: "1001_1500", text: "1001-1500" },
            { value: "1501_2000", text: "1501-2000" },
            { value: "2001_plus", text: "Over 2000" },
          ],
        },
        {
          type: "dropdown",
          name: "parental_education",
          analytics: true,
          title: "What is the highest level of education of your parents?",
          choices: [
            { value: "no_degree", text: "No degree" },
            { value: "high_school", text: "High School Diploma" },
            { value: "bachelor", text: "Bachelor's Degree" },
            { value: "master", text: "Master's Degree" },
            { value: "doctorate", text: "Doctorate" },
          ],
        },
        {
          type: "matrix",
          name: "personal_info",
          analytics: true,
          title:
            "Please answer the following questions",
            columns: [
              { value: 1, text: "Definitely not" },
              { value: 2, text: "Not much" },
              { value: 3, text: "Neutral" },
              { value: 4, text: "Yes" },
              { value: 5, text: "Yes a lot" },
            ],
          rows: [
            { value: "generous", text: "I am generous" },
            { value: "competitive", text: "I am competitive " },
          ],
        },
      ],
    },
  ],
  showProgressBar: "top",
  progressBarType: "questions",
  goNextPageAutomatic: false,
  showQuestionNumbers: "on",
  questionTitleLocation: "top",
  sendResultOnPageNext: true,
};

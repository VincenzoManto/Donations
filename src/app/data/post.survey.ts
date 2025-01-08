export const PostSurvey = {
  logoPosition: "right",
  completedHtml: "<h3>Thank you for participating!</h3>",
  pages: [
    /* {
      name: "habits",
      title: "Habits and Preferences",
      elements: [
        {
          analytics: true,

          type: "boolean",
          name: "volunteer",
          title: "Have you ever done any volunteer activities?",
        },
        {
          type: "boolean",
          analytics: true,

          name: "willing_to_donate",
          title:
            "Would you be willing to give up a small part of your salary to help those in need?",
        },
        {
          type: "boolean",
          analytics: true,

          name: "smoking",
          title: "Do you smoke?",
        },
        {
          type: "text",
          analytics: true,

          name: "smoking_expense",
          title: "If yes, how much do you spend on smoking per month?",
          visibleIf: "{smoking} = true",
          inputType: "number",
          validators: [{ type: "numeric", minValue: 0 }],
        },
        {
          type: "boolean",
          analytics: true,

          name: "alcohol",
          title: "Do you consume alcohol?",
        },
        {
          analytics: true,

          type: "text",
          name: "smoking_expense",
          title: "If yes, how much do you spend on alcohol per month?",
          visibleIf: "{alcohol} = true",
          inputType: "number",
          validators: [{ type: "numeric", minValue: 0 }],
        },
        {
          type: "boolean",
          name: "hobby_spending",
          title:
            "Do you have a specific spending hobby that accounts for more than 10% of your income?",
        },
      ],
    }, */
    {
      name: "post_survey",
      elements: [
        {
          analytics: true,
          isRequired: true,
          type: "matrix",
          name: "post_survey",
          title: "Please answer the following questions",
          columns: [
            { value: 1, text: "Definitely not" },
            { value: 2, text: "Not much" },
            { value: 3, text: "Neutral" },
            { value: 4, text: "Yes" },
            { value: 5, text: "Yes a lot" },
          ],
          rows: [
            {
              value: "effort_lives",
              text: "I felt that earning lives in the game required effort.",
            },
            {
              value: "bad_losing_lives",
              text: "I felt bad when I lost lives.",
            },
            {
              value: "good_playing",
              text: "I felt like I was good at the game.",
            },
            /* {
              value: "motivated_donate",
              text: "I felt more motivated to donate because I received lives from others.",
            }, */
            {
              value: "good_donation_decisions",
              text: "I felt good about my donation decisions.",
            },
            {
              value: "pressure_donate",
              text: "I felt pressure to donate.",
            },
            {
              value: "understood_donation_impact",
              text: "I understood how my donation would affect other players in the game.",
            },
            /* {
              value: "wtp",
              text: "I would be willing to pay a small sum to play this game.",
            }, */
            {
              value: "choices_myself",
              text: "The choices I made tell me a lot about myself.",
            },
            /*             {
              value: "choices_inner_values",
              text: "The choices I made reflect my inner goals and values",
            }, */

            /* {
              value: "privacy",
              text: "I am concerned about my privacy when sharing personal information online.",
            },
            {
              value: "financial_literacy",
              text: "I feel confident in my financial literacy and knowledge.",
            },
            {
              value: "future",
              text: "I understood the meaning of the questionnaire.",
            },
            { value: "savings", text: "I felt judged for my responses." }, */
          ],
        },
        {
          type: "rating",
          rateType: "smileys",
          name: "overall_evaluation",
          analytics: true,
          title:
            "How would you rate your overall experience?",
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

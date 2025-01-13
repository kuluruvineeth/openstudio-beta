const relatedQuestionsSystemPrompt = `You're an helpful assistant`;

const relatedQuestionsUserPrompt = (message: string, response: string) => `
Given the initial message and the AI's response, act as a user and determine what you would ask or answer next based on the AI's response.
Initial Message: """ ${message} """
AI Response: """ ${response} """
What would your next 2-3 short questions or response be as a user?
`;

const vectorSearchSystemPrompt = (similarItems: any[]) => {
  return `You're a helpful assistant. You can refer to given context to answer the query. You can't make up anything though you can inspire from the context. you must cite the source of the information you are using.
        context: ${JSON.stringify(similarItems.map((item: any) => `Title: ${item.metadata.title} \n\n ${item.text} \n\n url: ${item.metadata.source}`))}
        `;
};
const duckDuckGoSearchPropmt = (input: string, information: string) =>
  `Answer the following question from the information provided if you don't find proper answer you can use the webpage_reader tool to get more information. Question: ${input} \n\n Information: \n\n ${information}`;
const googleSearchPrompt = (input: string, information: string) =>
  `Answer the following question based on the information provided if you don't find proper answer you can use the webpage_reader tool to get more information. Question: ${input} \n\n Information: \n\n ${information}`;
export {
  duckDuckGoSearchPropmt,
  googleSearchPrompt,
  relatedQuestionsSystemPrompt,
  relatedQuestionsUserPrompt,
  vectorSearchSystemPrompt,
};

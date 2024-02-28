# Setting Up the Integration
This Botpress Wikipedia Integration offers a dynamic way to incorporate Wikipedia's vast repository of knowledge directly into your Botpress chatbot. This integration allows users to search for Wikipedia page titles, content, retrieve specific pages, and even access the featured articles or events.

Open your Botpress admin panel and navigate to the Integrations section by clicking on the gear icon.
Find the Wikipedia integration option and select Enable.
No additional external account or API key is required. Once enabled, the integration is ready to use.

## Integration Features

Upon enabling the integration, you unlock several capabilities within your Botpress chatbot:

Search Title: Allows the chatbot to search Wikipedia page titles based on given search terms.
Search Content: Enables the chatbot to search through Wikipedia page content for specific search terms.
Get Page: Retrieves a specific Wikipedia page using its title.
Get Page Content: Fetches the text content (headers and paragraphs) of a specified Wikipedia page or Wikimedia project.
Get Featured Article: Provides the featured Wikipedia article of the day.
Get On This Day: Shares historical events that occurred on a given day.

These features can be accessed through built-in actions within the chatbot.

## Response Format
The Botpress Wikipedia Integration utilizes a standardized response format to ensure consistency and ease of use when interacting with Wikipedia's API through your chatbot. This format is crucial for parsing and utilizing the data returned from Wikipedia efficiently. 
Below is the detailed structure of the response format:

success (Boolean): Indicates the success of the Wikipedia query. If Wikipedia returns valid information, this will be true; otherwise, it will be false. This flag can be used in the chatbot logic to check if the query was successful and if the subsequent actions or responses should be triggered.
log (String): Provides a comprehensive log of the transaction, including any errors or warnings encountered during the query. This is particularly useful for debugging purposes or understanding why a query may have failed or not returned the expected results.
data (Object): Contains the actual content returned by Wikipedia. The structure of this object (outputSchemas) varies depending on the action performed (e.g., searching titles, getting page content). It is designed to encapsulate the rich information provided by Wikipedia in a structured format that can be easily navigated and utilized within the chatbot.
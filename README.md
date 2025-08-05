# Agentforce UI Demo

This is a example Next.js app showcasing a custom UI for a Salesforce Agentforce Agent using the Agent API and Heroku.

## Tech Stack

- **UI Framework**: Next.js
- **Runtime**: Node.js
- **AI Agent**: Salesforce Agentforce (Agent API)
- **Styling**: Tailwind CSS

## Prerequisites

Before getting started, complete the [Get Started](https://developer.salesforce.com/docs/einstein/genai/guide/agent-api-get-started.html) in the Agentforce developer documentation. You will get the following values.

- **AGENT ID**
  - The ID of the agent that you want to interact with.
- **CONSUMER_KEY** / **CONSUMER_SECRET**
  - You can get the consumer key and secret by following the instructions in [Obtain Credentials](https://developer.salesforce.com/docs/einstein/genai/guide/agent-api-get-started.html#obtain-credentials).
- **MY_DOMAIN_URL**
  - From Salesforce Setup, search for My Domain. Copy the value shown in the Current My Domain URL field.

## Getting Started

1.  Obtain the following values from Salesforce:

SF_AGENT_ID=XXXXXXXXX
SF_CONSUMER_KEY=XXXXXXXXXXXXXX
SF_CONSUMER_SECRET=XXXXXXXXXXXXXX
SF_MY_DOMAIN_URL=XXXXXXXXXX

# UI Configuration (Optional - defaults provided)
NEXT_PUBLIC_APP_TITLE=AI Chat Assistant
NEXT_PUBLIC_APP_DESCRIPTION=Your intelligent AI assistant powered by Agentforce
NEXT_PUBLIC_APP_INTRO_MESSAGE=Hello! I'm your AI assistant. How can I help you today?

1.  Deploy via the button below:

TODO: Heroku button

<a href="https://www.heroku.com/deploy?template=https://github.com/misu007/agentforce-headless-agent-nextjs-demo/">
<img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>


## License

MIT License

# Decentralized Storybook

Welcome to Decentralized Storybook! This is a decentralized application (dApp) built on the Ethereum blockchain where users can share, read, and crowdfund stories using smart contracts.

## Features

- **Story Sharing**: Users can publish their stories and quotes on the platform for others to read. User can add like or also can contribute Ethers to the post.
- **Crowdfunding**: Any user can contribute to the creation of big novels and stories using a crowdfunding technique. Here's how it works: When a user writes a story, it becomes an option for a particular chapter. The story that garners enough support in terms of ethers from viewers within a given deadline will be selected for that chapter. This democratic approach ensures that the most captivating and supported stories become an integral part of the narrative, fostering a dynamic and engaging storytelling experience.
- **Decentralization**: Stories and transactions are stored on the Ethereum blockchain, ensuring transparency and censorship resistance.
- **Security**: Smart contracts govern the crowdfunding process, ensuring that funds are securely managed and distributed.

## Technologies Used

- **Ethereum Blockchain**: Smart contracts are deployed on the Ethereum blockchain to manage story crowdfunding and ownership.
- **Solidity**: Smart contracts are written in Solidity, Ethereum's smart contract programming language.
- **Next.js**: The frontend of the application is built using Next.js, a React framework for server-rendered applications.
- **ethers.js**: ethers.js is used to interact with the Ethereum blockchain from the frontend, enabling users to read stories and contribute funds.
- **IPFS (InterPlanetary File System)**: Story content is stored on IPFS for decentralized and immutable file storage. Here, Pinata has been used.
- **Truffle**: Truffle is used for smart contract development, testing, and deployment.

## Getting Started

### 1) Install Ganache

### 2) Install Metamask Extension
  ```bash
  - Create New Network with localhost and port in which Ganache is connected.
  - Using Private Key, Import the account to the metamask
  ```

### 3) Deploy Contract:
   ```bash
   cd Backend
   truffle migrate
   ```
  -  Create a config.tsx file in frontend and add contract address to it.

### 4) Run Next.js
  ```bash
  cd Frontend
  npm run dev
  ```
## Screenshots 

### Front Page:
<img width="959" alt="login" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/1d96020a-986e-41f4-bf52-73bd7f6a9eb3">

### Login Page:
<img width="959" alt="loginkk" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/53b1b95a-362c-4454-82d8-d37d3fdebe1c">

### Signup Page:
<img width="959" alt="signup" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/8a72ff39-20af-41f6-8c88-ef7f23349db8">

### Home Page:
<img width="959" alt="Home" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/1d5062d9-640f-4a1a-84a5-356ca067fea7">

### Create Short stories:
<img width="956" alt="create" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/233c28f4-2724-4d01-9cbb-5f454191c58e">

### Create Quotes
<img width="958" alt="createQuotes" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/ad2282f0-6a69-4785-9ec1-90c2fe85864e">

### Contribution Page:
<img width="959" alt="Contribution" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/11efe5a5-d82e-4c95-8294-3e175d444d1a">

### Create Big Story:
<img width="959" alt="contribution Create" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/b6d2cfe7-80d4-47f3-a608-3c292c2ef5ad">

### Read Chapters of story:
<img width="959" alt="chapterReader" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/e73c583d-c84f-4d0a-9db8-ba93416fe969">

### Create option for campaign:
<img width="959" alt="option creator" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/05d368bb-9551-4107-9b82-0322cdd16b6b">

### CrowdFunding Page:
<img width="959" alt="Crowdfunding" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/c31e32c9-dfe4-45fa-8050-9c391e84272a">

### Donation of ethers:
<img width="947" alt="Donation" src="https://github.com/lakshman-karthick/Decentralized-Storybook/assets/81451604/30893c09-2105-4d8d-a134-34b690907e36">


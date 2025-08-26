# Chat Components NPM Package Publishing Guide

This guide outlines how to extract the chat components and logic from this Agentforce UI application and publish them as an independent NPM package for reuse in other applications.

## Table of Contents

1. [Package Structure](#package-structure)
2. [Core Components Analysis](#core-components-analysis)
3. [Dependencies](#dependencies)
4. [Package Setup](#package-setup)
5. [Build Configuration](#build-configuration)
6. [TypeScript Configuration](#typescript-configuration)
7. [Styling Strategy](#styling-strategy)
8. [API Integration](#api-integration)
9. [Testing Strategy](#testing-strategy)
10. [Publishing Process](#publishing-process)
11. [Usage Examples](#usage-examples)
12. [Migration Considerations](#migration-considerations)

## Package Structure

The recommended package structure for `@your-org/agentforce-chat`:

```
agentforce-chat/
├── src/
│   ├── components/
│   │   ├── ChatBubble.tsx           # Main chat widget
│   │   ├── ChatContainer.tsx        # Chat message container
│   │   ├── ChatHeader.tsx           # Chat header component
│   │   ├── ChatMessage.tsx          # Individual message component
│   │   ├── ChatPublisher.tsx        # Message input component
│   │   └── index.ts                 # Component exports
│   ├── hooks/
│   │   ├── ChatContext.tsx          # Chat context definition
│   │   ├── ChatProvider.tsx         # Chat state provider
│   │   ├── useChat.ts               # Chat hook
│   │   └── index.ts                 # Hook exports
│   ├── utils/
│   │   ├── chunkValidator.ts        # Streaming chunk validation
│   │   ├── sse.ts                   # Server-sent events handler
│   │   ├── types.ts                 # TypeScript definitions
│   │   └── index.ts                 # Utility exports
│   ├── styles/
│   │   └── chat.css                 # Optional default styles
│   └── index.ts                     # Main package exports
├── dist/                            # Built files (generated)
├── examples/                        # Usage examples
├── docs/                            # Documentation
├── package.json
├── tsconfig.json
├── rollup.config.js                 # Build configuration
├── tailwind.config.js               # Tailwind preset (optional)
└── README.md
```

## Core Components Analysis

### 1. ChatBubble (Main Entry Point)
- **Purpose**: Main chat widget with bubble and expandable interface
- **Dependencies**: useChat hook, AgentforceLogo, ChatContainer, ChatHeader
- **Props**: `welcomeMessage`, `agentId?`, `agentName?`
- **Features**: Responsive design, notification indicator, expand/collapse

### 2. ChatContainer (Message Management)
- **Purpose**: Manages message flow and streaming responses
- **Dependencies**: ChatPublisher, ChatMessage, sendStreamingMessage, ChunkValidator
- **Props**: `welcomeMessage?`, `agentId?`
- **Features**: SSE handling, chunk validation, typing indicators

### 3. ChatMessage (Message Display)
- **Purpose**: Renders individual messages with markdown support
- **Dependencies**: ReactMarkdown, AgentforceLogo, HerokuIcon
- **Props**: Message type, content, status, typing state
- **Features**: Markdown rendering, typing animation, action buttons

### 4. ChatPublisher (Input Interface)
- **Purpose**: Message input with send functionality
- **Dependencies**: None (pure React)
- **Props**: `onPostMessage` callback
- **Features**: Auto-resize textarea, keyboard shortcuts, send button

### 5. ChatHeader (Chat Header)
- **Purpose**: Chat interface header with controls
- **Dependencies**: HerokuIcon
- **Props**: Display name, expand state, callbacks
- **Features**: Expand/collapse, close button, branding

## Dependencies

### Peer Dependencies (Consumer Provides)
```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

### Direct Dependencies
```json
{
  "react-markdown": "^10.1.0",
  "tailwind-merge": "^3.3.1"
}
```

### Optional Dependencies (Based on Implementation)
```json
{
  "axios": "^1.8.1",
  "zod": "^3.24.2"
}
```

### Development Dependencies
```json
{
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@rollup/plugin-commonjs": "^25.0.0",
  "@rollup/plugin-node-resolve": "^15.0.0",
  "@rollup/plugin-typescript": "^11.0.0",
  "rollup": "^4.0.0",
  "rollup-plugin-peer-deps-external": "^2.2.4",
  "rollup-plugin-postcss": "^4.0.2",
  "typescript": "^5.8.2",
  "tailwindcss": "^3.4.1",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0"
}
```

## Package Setup

### 1. Initialize Package

```bash
mkdir agentforce-chat
cd agentforce-chat
npm init -y
```

### 2. Package.json Configuration

```json
{
  "name": "@your-org/agentforce-chat",
  "version": "1.0.0",
  "description": "Reusable chat components for Agentforce integration",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles/chat.css"
  },
  "scripts": {
    "build": "rollup -c",
    "build:watch": "rollup -c -w",
    "prepare": "npm run build",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "dependencies": {
    "react-markdown": "^10.1.0",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@rollup/plugin-commonjs": "^25.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "rollup": "^4.0.0",
    "rollup-plugin-peer-deps-external": "^2.2.4",
    "rollup-plugin-postcss": "^4.0.2",
    "typescript": "^5.8.2"
  },
  "keywords": [
    "react",
    "chat",
    "agentforce",
    "ai",
    "ui-components",
    "streaming"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/agentforce-chat"
  },
  "license": "MIT"
}
```

## Build Configuration

### Rollup Configuration (rollup.config.js)

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
    }),
    postcss({
      extract: 'styles/chat.css',
      minimize: true,
      config: {
        path: './postcss.config.js',
      },
    }),
  ],
  external: ['react', 'react-dom'],
};
```

### PostCSS Configuration (postcss.config.js)

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "examples"
  ]
}
```

## Styling Strategy

### Option 1: Tailwind CSS Integration

Create a Tailwind preset for consistent styling:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 1.5s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### Option 2: CSS Modules

For projects not using Tailwind, provide CSS modules:

```css
/* src/styles/chat.css */
.chatBubble {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
}

.chatContainer {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* ... more styles */
```

### Option 3: Styled Components (Alternative)

For maximum flexibility, consider styled-components or emotion.

## API Integration

### Configurable API Handler

```typescript
// src/utils/types.ts
export interface ChatConfig {
  apiEndpoint: string;
  agentId?: string;
  headers?: Record<string, string>;
  onError?: (error: string) => void;
}

export interface SSECallbacks {
  onProgressIndicator: (message: string) => void;
  onTextChunk: (message: string, offset: number) => void;
  onInform: (message: string) => void;
  onEndOfTurn: () => void;
  onError?: (error: string) => void;
}
```

```typescript
// src/utils/sse.ts
export const createStreamingMessageSender = (config: ChatConfig) => {
  return async (params: {
    userMessage: string;
    sequenceId: number;
    callbacks: SSECallbacks;
  }) => {
    // Implementation similar to current sse.ts but configurable
    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'text/event-stream',
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify({
        message: params.userMessage,
        sequenceId: params.sequenceId,
        agentId: config.agentId,
      }),
    });
    
    // ... rest of SSE handling
  };
};
```

## Testing Strategy

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
  ],
};
```

### Example Test

```typescript
// src/components/__tests__/ChatBubble.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatBubble } from '../ChatBubble';
import { ChatProvider } from '../../hooks/ChatProvider';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChatProvider welcomeMessage="Hello!">
    {children}
  </ChatProvider>
);

describe('ChatBubble', () => {
  it('renders chat bubble when closed', () => {
    render(
      <TestWrapper>
        <ChatBubble 
          welcomeMessage="Hello!" 
          agentName="Test Agent" 
        />
      </TestWrapper>
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('opens chat when bubble is clicked', () => {
    render(
      <TestWrapper>
        <ChatBubble 
          welcomeMessage="Hello!" 
          agentName="Test Agent" 
        />
      </TestWrapper>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Test Agent')).toBeInTheDocument();
  });
});
```

## Publishing Process

### 1. Pre-publish Checklist

- [ ] All components exported from main index
- [ ] TypeScript declarations generated
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Version bumped appropriately
- [ ] Build artifacts generated

### 2. NPM Publishing Commands

```bash
# Build the package
npm run build

# Run tests
npm test

# Publish to NPM
npm publish --access public

# For scoped packages
npm publish --access public --registry https://registry.npmjs.org/
```

### 3. GitHub Actions CI/CD

```yaml
# .github/workflows/publish.yml
name: Publish Package

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build package
        run: npm run build
      
      - name: Publish to NPM
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Usage Examples

### Basic Implementation

```tsx
import React from 'react';
import { 
  ChatBubble, 
  ChatProvider, 
  createStreamingMessageSender 
} from '@your-org/agentforce-chat';
import '@your-org/agentforce-chat/styles';

const App = () => {
  const chatConfig = {
    apiEndpoint: '/api/chat',
    agentId: 'your-agent-id',
    headers: {
      'Authorization': 'Bearer your-token',
    },
  };

  return (
    <ChatProvider 
      welcomeMessage="Hello! How can I help you today?"
      streamingMessageSender={createStreamingMessageSender(chatConfig)}
    >
      <div className="app">
        {/* Your app content */}
        <ChatBubble 
          welcomeMessage="Hello! How can I help you today?"
          agentName="My Assistant"
        />
      </div>
    </ChatProvider>
  );
};
```

### Custom Styling

```tsx
import { ChatBubble } from '@your-org/agentforce-chat';

const CustomChat = () => (
  <ChatBubble 
    welcomeMessage="Welcome!"
    agentName="Custom Agent"
    className="custom-chat-bubble"
    theme={{
      primaryColor: '#your-brand-color',
      borderRadius: '12px',
    }}
  />
);
```

### Advanced Configuration

```tsx
import { 
  useChatContext, 
  ChatContainer,
  ChatProvider 
} from '@your-org/agentforce-chat';

const CustomChatInterface = () => {
  const { messages, sendMessage, isOpen } = useChatContext();
  
  return (
    <div className="custom-chat-interface">
      {isOpen && (
        <ChatContainer 
          welcomeMessage="Custom welcome!"
          onMessageSent={(message) => {
            // Custom logic before sending
            console.log('Sending:', message);
            sendMessage(message);
          }}
        />
      )}
    </div>
  );
};
```

## Migration Considerations

### From Current Implementation

1. **Icon Dependencies**: Replace AgentforceLogo and HerokuIcon with configurable icon props or provide default fallbacks

2. **Environment Variables**: Remove hard-coded environment variable references and make them configurable

3. **API Routes**: Abstract the `/api/message` endpoint to be configurable

4. **Styling**: Ensure Tailwind classes are either included in the build or made optional

5. **State Management**: Consider making the ChatProvider more flexible to integrate with existing state management

### Breaking Changes to Handle

- **Props Interface**: Some props may need to be renamed or restructured
- **Event Handlers**: Callback signatures might change
- **Styling**: CSS class names might be prefixed or changed
- **Dependencies**: Some peer dependencies might be required

### Migration Script Example

```typescript
// migration-helper.ts
export const migrateToPackage = {
  // Helper functions to ease migration
  createCompatibilityWrapper: (OldComponent: any) => {
    return (props: any) => {
      // Map old props to new props structure
      const newProps = {
        welcomeMessage: props.initialMessage,
        agentName: props.botName,
        // ... other mappings
      };
      return <NewComponent {...newProps} />;
    };
  },
};
```

## Additional Considerations

### 1. Accessibility
- Ensure ARIA labels are configurable
- Support keyboard navigation
- Screen reader compatibility

### 2. Internationalization
- Support for RTL languages
- Configurable text strings
- Date/time formatting options

### 3. Performance
- Code splitting for large dependencies
- Lazy loading of components
- Memory leak prevention

### 4. Browser Compatibility
- Polyfills for older browsers
- Feature detection
- Graceful degradation

### 5. Security
- Input sanitization
- XSS prevention
- Content Security Policy compliance

This guide provides a comprehensive roadmap for extracting and publishing your chat components as a reusable NPM package. The modular approach ensures that other applications can easily integrate and customize the chat functionality while maintaining the core features and reliability of your current implementation.

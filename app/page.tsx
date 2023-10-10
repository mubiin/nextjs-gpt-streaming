'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useChat } from 'ai/react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [fetching, setFetching] = useState(false);

  const { messages, handleSubmit, handleInputChange } = useChat({
    // We could skip this since this is used as the default value
    api: '/api/chat',
    onFinish: () => setFetching(false),
  });

  const lastMessage = messages[messages.length - 1];
  const response =
    lastMessage?.role === 'assistant' ? lastMessage?.content : null;

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    handleInputChange(e);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFetching(true);
    handleSubmit(e, {
      options: {
        body: {
          prompt,
        },
      },
    });
  };

  return (
    <main className={styles.main}>
      <form className={styles.form} onSubmit={onSubmit}>
        <label htmlFor="prompt">Ask KafkaBot 😸🤖</label>
        <textarea
          name="prompt"
          value={prompt}
          onChange={onTextChange}
          autoFocus
        />
        <button type="submit" disabled={fetching || !prompt}>
          Submit
        </button>
      </form>

      {response && (
        <div className={styles.response}>
          <h3>Response</h3>
          <pre>{response}</pre>
        </div>
      )}
    </main>
  );
}

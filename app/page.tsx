'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [fetching, setFetching] = useState(false);

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFetching(true);
    try {
      await streamResponse();
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const streamResponse = async () => {
    setResponse('');
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResponse((prev) => prev + chunkValue);
    }
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

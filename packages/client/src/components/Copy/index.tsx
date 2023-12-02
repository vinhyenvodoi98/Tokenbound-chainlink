import { useState } from 'react';

import { CheckIcon, CopyIcon } from '../Icon';

export default function Copy({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUsername = (name: string) => {
    navigator.clipboard.writeText(name);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button onClick={() => handleCopyUsername(text)}>
      {isCopied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

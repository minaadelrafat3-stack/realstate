import { useEffect, useState, useCallback } from 'react';

interface RouteState {
  path: string;
  query: URLSearchParams;
}

function parseHash(): RouteState {
  const hash = window.location.hash.slice(1) || '/';
  const [path, queryString] = hash.split('?');
  return {
    path: path || '/',
    query: new URLSearchParams(queryString || ''),
  };
}

export function useRoute() {
  const [route, setRoute] = useState<RouteState>(parseHash);

  useEffect(() => {
    const handler = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}

export function navigate(path: string) {
  window.location.hash = path;
}

interface LinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Link({ to, className, children, onClick }: LinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(to);
      onClick?.();
    },
    [to, onClick],
  );
  return (
    <a href={`#${to}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

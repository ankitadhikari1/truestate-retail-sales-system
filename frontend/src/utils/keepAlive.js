let keepAliveInterval = null;

export function startKeepAlive() {
  if (keepAliveInterval) {
    return;
  }

  const pingBackend = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
      let baseUrl = API_BASE_URL;
      
      if (baseUrl.startsWith('http')) {
        if (baseUrl.endsWith('/api')) {
          baseUrl = baseUrl.replace('/api', '');
        }
        const healthUrl = `${baseUrl}/health`;
        
        await fetch(healthUrl, {
          method: 'GET',
          cache: 'no-cache',
          keepalive: true
        }).catch(() => {
        });
      }
    } catch (error) {
    }
  };

  pingBackend();
  
  keepAliveInterval = setInterval(() => {
    if (!document.hidden) {
      pingBackend();
    }
  }, 15000);
}

export function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}


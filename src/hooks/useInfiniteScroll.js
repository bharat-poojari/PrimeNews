import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

export const useInfiniteScroll = (fetchMore, hasMore) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    await fetchMore(page + 1);
    setPage(prev => prev + 1);
    setLoading(false);
  }, [loading, hasMore, page, fetchMore]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return { ref, loading, page, reset };
};
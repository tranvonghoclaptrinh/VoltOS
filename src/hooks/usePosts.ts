import { useState, useEffect, useCallback, useRef } from 'react';
import { Post } from '../types';
import { mockApi } from '../mock/mockApi';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isInitialMount = useRef(true);

  const fetchPosts = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    const data = await mockApi.getPosts(pageNum, 5);
    
    setPosts(data);

    if (data.length < pageNum * 5) {
      setHasMore(false);
    }

    setLoading(false);
    setLoadingMore(false);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      fetchPosts(1, true);
      isInitialMount.current = false;
    }
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  }, [loadingMore, hasMore, page, fetchPosts]);

  const createPost = async (
    content: string, 
    media?: { type: 'image' | 'video'; url: string }[],
    poll?: any,
    location?: string,
    visibility: 'public' | 'friends' | 'private' = 'public'
  ) => {
    const newPost = await mockApi.createPost(content, media, poll, location, visibility);
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const likePost = async (postId: string, userId: string) => {
    const updatedPost = await mockApi.likePost(postId, userId);
    setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
  };

  const reactToPost = async (postId: string, userId: string, emoji: string) => {
    const updatedPost = await mockApi.reactToPost(postId, userId, emoji);
    setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
  };

  const addComment = async (postId: string, content: string) => {
    const updatedPost = await mockApi.addComment(postId, content);
    setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
  };

  return { 
    posts, 
    loading, 
    loadingMore, 
    hasMore, 
    loadMore, 
    createPost, 
    likePost, 
    reactToPost,
    addComment, 
    refresh: () => fetchPosts(1, true) 
  };
};

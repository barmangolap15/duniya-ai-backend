const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function apiFetch(path: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  auth: {
    register: (data: { email: string; name: string; password: string; role?: string }) =>
      apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => apiFetch('/auth/me'),
  },
  users: {
    getPublic: (id: string) => apiFetch(`/users/public/${id}`),
    updateProfile: (data: any) => apiFetch('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  quiz: {
    getQuestions: () => apiFetch('/quiz/questions'),
    submit: (answers: any) => apiFetch('/quiz/submit', { method: 'POST', body: JSON.stringify(answers) }),
  },
  dashboard: {
    get: () => apiFetch('/dashboard'),
  },
  missions: {
    getAll: () => apiFetch('/missions'),
    getOne: (id: string) => apiFetch(`/missions/${id}`),
    getSubmission: (id: string) => apiFetch(`/missions/${id}/submission`),
  },
  submissions: {
    autosave: (data: { missionId: string; htmlCode: string; cssCode: string; jsCode: string }) =>
      apiFetch('/submissions/autosave', { method: 'POST', body: JSON.stringify(data) }),
    submit: (data: { missionId: string; htmlCode: string; cssCode: string; jsCode: string }) =>
      apiFetch('/submissions/submit', { method: 'POST', body: JSON.stringify(data) }),
    portfolio: () => apiFetch('/submissions/portfolio'),
  },
  parent: {
    getChildren: () => apiFetch('/parent/children'),
    getChildCommunications: (studentId: string) => apiFetch(`/parent/children/${studentId}/communications`),
    link: (studentEmail: string) =>
      apiFetch('/parent/link', { method: 'POST', body: JSON.stringify({ studentEmail }) }),
    cheer: (studentId: string, message: string) =>
      apiFetch('/parent/cheer', { method: 'POST', body: JSON.stringify({ studentId, message }) }),
  },
  mentor: {
    getQueue: (status?: string) => apiFetch(`/mentor/queue${status ? `?status=${status}` : ''}`),
    review: (submissionId: string, data: { status: 'APPROVED' | 'REJECTED'; feedback: string; rating: number }) =>
      apiFetch(`/mentor/review/${submissionId}`, { method: 'POST', body: JSON.stringify(data) }),
    getStats: () => apiFetch('/mentor/stats'),
    getMentees: () => apiFetch('/mentor/mentees'),
  },
  mentorship: {
    getThreads: () => apiFetch('/mentorship/threads'),
    getThread: (id: string) => apiFetch(`/mentorship/threads/${id}`),
    createThread: (data: {
      mentorId?: string;
      studentId?: string;
      missionId?: string;
      subject: string;
      message: string;
      codeSnippet?: string;
      stepNumber?: number;
      priority?: 'NORMAL' | 'URGENT' | 'CODE_REVIEW';
    }) => apiFetch('/mentorship/threads', { method: 'POST', body: JSON.stringify(data) }),
    addMessage: (threadId: string, data: { content: string; codeSnippet?: string; stepNumber?: number }) =>
      apiFetch(`/mentorship/threads/${threadId}/messages`, { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (threadId: string, status: string) =>
      apiFetch(`/mentorship/threads/${threadId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    getMentors: () => apiFetch('/mentorship/mentors'),
  },
  recruiter: {
    getCandidates: (params?: { track?: string; search?: string; minLevel?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.track) searchParams.set('track', params.track);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.minLevel) searchParams.set('minLevel', params.minLevel.toString());
      const qs = searchParams.toString();
      return apiFetch(`/recruiter/candidates${qs ? `?${qs}` : ''}`);
    },
    toggleBookmark: (studentId: string) =>
      apiFetch(`/recruiter/bookmark/${studentId}`, { method: 'POST' }),
    getSaved: () => apiFetch('/recruiter/saved'),
    outreach: (studentId: string, data: { roleTitle: string; company: string; note: string }) =>
      apiFetch(`/recruiter/outreach/${studentId}`, { method: 'POST', body: JSON.stringify(data) }),
  },
};

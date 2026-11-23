import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  Hash,
  Volume2,
  Megaphone,
  Plus,
  Compass,
  Settings,
  Mic,
  MicOff,
  Headphones,
  Pin,
  Users,
  Search,
  Send,
  Smile,
  Paperclip,
  Reply,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Shield,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Check,
  X,
  Copy,
  LogOut,
  MoreVertical,
  MessageSquare,
  Sparkles,
  Lock,
  Bell,
  Ban,
  Clock,
  UserMinus,
  Menu,
  Radio,
  Image as ImageIcon,
  Gift,
  AtSign,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// ============================================================================
// FIREBASE INITIALIZATION & CONFIGURATION
// ============================================================================
const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : {
      apiKey: "demo-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'origin-chat-platform';

// ============================================================================
// CONSTANTS, MOCK COMMUNITY BOTS & CURATED ASSETS
// ============================================================================
const STATUS_CONFIG = {
  online: { label: 'Online', color: 'bg-emerald-500', ring: 'ring-emerald-500/30', text: 'text-emerald-400' },
  idle: { label: 'Idle', color: 'bg-amber-400', ring: 'ring-amber-400/30', text: 'text-amber-400' },
  dnd: { label: 'Do Not Disturb', color: 'bg-rose-500', ring: 'ring-rose-500/30', text: 'text-rose-400' },
  invisible: { label: 'Invisible', color: 'bg-slate-500', ring: 'ring-slate-500/30', text: 'text-slate-400' }
};

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-violet-600'
];

const BANNER_GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #ec4899 100%)',
  'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
  'linear-gradient(135deg, #e11d48 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #1e293b 0%, #334155 50%, #6366f1 100%)',
  'linear-gradient(135deg, #0f172a 0%, #312e81 100%)'
];

const QUICK_EMOJIS = ['🔥', '🚀', '❤️', '😂', '👏', '👀', '💯', '✨', '🎉', '🤔', '👍', '💜'];

const CURATED_GIFS = [
  { id: 'g1', title: 'Mind Blown', emoji: '🤯', bg: 'from-purple-600 to-indigo-700', label: 'MIND BLOWN // 4K' },
  { id: 'g2', title: 'Ship It!', emoji: '🚀', bg: 'from-emerald-600 to-cyan-700', label: 'DEPLOYING TO PROD 🚀' },
  { id: 'g3', title: 'GG WP', emoji: '🏆', bg: 'from-amber-500 to-rose-600', label: 'VICTORY ROYALE // GG' },
  { id: 'g4', title: 'Coding Intensifies', emoji: '💻', bg: 'from-slate-800 to-indigo-900', label: 'HACKING THE MAINFRAME' },
  { id: 'g5', title: 'Vibe Check', emoji: '🎧', bg: 'from-pink-600 to-violet-700', label: 'LO-FI BEATS & CHILL' },
  { id: 'g6', title: 'Applause', emoji: '👏', bg: 'from-teal-600 to-emerald-700', label: 'STANDING OVATION' }
];

const COMMUNITY_MEMBERS_SEED = [
  {
    uid: 'bot-nova',
    displayName: 'Nova Architect',
    username: 'nova',
    tag: '0001',
    avatarEmoji: '⚡',
    avatarGradient: 'from-indigo-500 to-violet-600',
    banner: BANNER_GRADIENTS[0],
    status: 'online',
    customStatus: 'Building Origin Core v2.4',
    bio: 'Lead systems architect & distributed real-time enthusiast. Always down to pair program.',
    roleId: 'role-founder'
  },
  {
    uid: 'bot-kaelen',
    displayName: 'Kaelen Vance',
    username: 'kaelen',
    tag: '4042',
    avatarEmoji: '🛡️',
    avatarGradient: 'from-emerald-500 to-teal-600',
    banner: BANNER_GRADIENTS[1],
    status: 'online',
    customStatus: 'Moderating & chilling in Voice',
    bio: 'Community guardian, security researcher, and synthwave producer.',
    roleId: 'role-mod'
  },
  {
    uid: 'bot-lyra',
    displayName: 'Lyra Chen',
    username: 'lyra_ui',
    tag: '8821',
    avatarEmoji: '🎨',
    avatarGradient: 'from-rose-500 to-pink-600',
    banner: BANNER_GRADIENTS[2],
    status: 'idle',
    customStatus: 'Designing dark mode palettes ✨',
    bio: 'Product designer obsessed with micro-interactions and crisp typography.',
    roleId: 'role-mod'
  },
  {
    uid: 'bot-orion',
    displayName: 'Orion Dev',
    username: 'orion',
    tag: '1337',
    avatarEmoji: '🪐',
    avatarGradient: 'from-cyan-500 to-blue-600',
    banner: BANNER_GRADIENTS[3],
    status: 'dnd',
    customStatus: 'Deep focus mode — ping if urgent',
    bio: 'WebRTC & low-latency audio/video engineer.',
    roleId: 'role-member'
  },
  {
    uid: 'bot-soren',
    displayName: 'Soren K.',
    username: 'soren',
    tag: '9010',
    avatarEmoji: '🐺',
    avatarGradient: 'from-amber-500 to-orange-600',
    banner: BANNER_GRADIENTS[4],
    status: 'invisible',
    customStatus: 'AFK — Coffee refill',
    bio: 'Full-stack tinkerer & late-night gamer.',
    roleId: 'role-member'
  }
];

const DEFAULT_SERVERS_SEED = [
  {
    id: 'origin-hq',
    name: 'Origin Headquarters',
    icon: '🌌',
    inviteCode: 'ORIGIN-HQ',
    description: 'The official hub for Origin builders, creators, and real-time community pioneers.',
    ownerId: 'bot-nova',
    roles: [
      { id: 'role-founder', name: 'Founders', color: '#818CF8', permissions: { manageServer: true, manageChannels: true, kickBan: true, sendMessages: true, manageMessages: true } },
      { id: 'role-mod', name: 'Moderators', color: '#34D399', permissions: { manageServer: false, manageChannels: true, kickBan: true, sendMessages: true, manageMessages: true } },
      { id: 'role-member', name: 'Members', color: '#94A3B8', permissions: { manageServer: false, manageChannels: false, kickBan: false, sendMessages: true, manageMessages: false } }
    ],
    categories: [
      { id: 'cat-info', name: 'INFORMATION', collapsed: false },
      { id: 'cat-text', name: 'COMMUNITY CHANNELS', collapsed: false },
      { id: 'cat-voice', name: 'VOICE & STAGE LOUNGES', collapsed: false }
    ],
    channels: [
      { id: 'ch-announcements', categoryId: 'cat-info', name: 'announcements', type: 'announcement', topic: 'Official Origin platform releases, patch notes & community milestones.' },
      { id: 'ch-general', categoryId: 'cat-text', name: 'general', type: 'text', topic: 'Hang out, share ideas, and test Markdown, code blocks, replies & reactions!' },
      { id: 'ch-showcase', categoryId: 'cat-text', name: 'project-showcase', type: 'text', topic: 'Drop screenshots, demos, and architecture feedback.' },
      { id: 'ch-lounge', categoryId: 'cat-voice', name: 'Origin Voice Lounge', type: 'voice', topic: 'Drop-in WebRTC audio, video & screen sharing.' },
      { id: 'ch-cowork', categoryId: 'cat-voice', name: 'Deep Work & Stage', type: 'voice', topic: 'Quiet co-working & live screen demos.' }
    ]
  },
  {
    id: 'cyber-builders',
    name: 'Synth & Code Lab',
    icon: '⚡',
    inviteCode: 'SYNTH-99',
    description: 'Creative coding, shaders, AI agents, and midnight hackathons.',
    ownerId: 'bot-kaelen',
    roles: [
      { id: 'role-founder', name: 'Lab Leads', color: '#F472B6', permissions: { manageServer: true, manageChannels: true, kickBan: true, sendMessages: true, manageMessages: true } },
      { id: 'role-member', name: 'Hackers', color: '#38BDF8', permissions: { manageServer: false, manageChannels: false, kickBan: false, sendMessages: true, manageMessages: false } }
    ],
    categories: [
      { id: 'cat-lab-1', name: 'HACKATHON', collapsed: false },
      { id: 'cat-lab-2', name: 'LIVE PODS', collapsed: false }
    ],
    channels: [
      { id: 'ch-lab-general', categoryId: 'cat-lab-1', name: 'lab-chat', type: 'text', topic: 'Share snippets, shaders, and experiments.' },
      { id: 'ch-lab-voice', categoryId: 'cat-lab-2', name: 'Jam Session', type: 'voice', topic: 'Live audio & screen share.' }
    ]
  }
];

const INITIAL_SEED_MESSAGES = [
  {
    id: 'seed-1',
    channelId: 'ch-announcements',
    serverId: 'origin-hq',
    authorId: 'bot-nova',
    authorName: 'Nova Architect',
    authorTag: '0001',
    authorAvatar: '⚡',
    authorGradient: 'from-indigo-500 to-violet-600',
    authorRoleColor: '#818CF8',
    content: '🚀 **Welcome to Origin v2.4!**\nWe have upgraded our real-time messaging engine with:\n- Full **Markdown** & syntax-styled `code blocks`\n- Live **WebRTC Voice, Camera & Screen Sharing** stages\n- Granular **Roles & Moderation** controls\n\nJump into `#general` or join the **Origin Voice Lounge** to test everything live!',
    pinned: true,
    reactions: { '🚀': ['bot-kaelen', 'bot-lyra'], '🔥': ['bot-orion'] },
    createdAtMs: Date.now() - 1000 * 60 * 55
  },
  {
    id: 'seed-2',
    channelId: 'ch-general',
    serverId: 'origin-hq',
    authorId: 'bot-nova',
    authorName: 'Nova Architect',
    authorTag: '0001',
    authorAvatar: '⚡',
    authorGradient: 'from-indigo-500 to-violet-600',
    authorRoleColor: '#818CF8',
    content: 'Hey everyone! Welcome to **Origin**. Try sending a message with `**bold**`, `*italics*`, or a fenced code block:\n```js\nconst origin = connectRealtime({ latency: "ultra-low", theme: "obsidian" });\norigin.emit("hello_world");\n```',
    pinned: true,
    reactions: { '✨': ['bot-lyra'], '💯': ['bot-kaelen'] },
    createdAtMs: Date.now() - 1000 * 60 * 24
  },
  {
    id: 'seed-3',
    channelId: 'ch-general',
    serverId: 'origin-hq',
    authorId: 'bot-lyra',
    authorName: 'Lyra Chen',
    authorTag: '8821',
    authorAvatar: '🎨',
    authorGradient: 'from-rose-500 to-pink-600',
    authorRoleColor: '#34D399',
    content: 'The high-contrast obsidian slate theme feels *so* crisp. Also, click on any user avatar in chat or the right-hand member list to inspect their profile card or send a DM!',
    pinned: false,
    reactions: { '❤️': ['bot-nova'] },
    createdAtMs: Date.now() - 1000 * 60 * 12
  },
  {
    id: 'seed-4',
    channelId: 'ch-general',
    serverId: 'origin-hq',
    authorId: 'bot-kaelen',
    authorName: 'Kaelen Vance',
    authorTag: '4042',
    authorAvatar: '🛡️',
    authorGradient: 'from-emerald-500 to-teal-600',
    authorRoleColor: '#34D399',
    replyTo: { id: 'seed-3', authorName: 'Lyra Chen', content: 'The high-contrast obsidian slate theme feels *so* crisp...' },
    content: '100%! And if you hop into **Origin Voice Lounge** on the left sidebar, you can toggle your mic, camera, screen share, or Push-to-Talk (`Spacebar`).',
    pinned: false,
    reactions: { '🎧': ['bot-lyra', 'bot-nova'] },
    createdAtMs: Date.now() - 1000 * 60 * 5
  },
  {
    id: 'seed-5',
    channelId: 'ch-showcase',
    serverId: 'origin-hq',
    authorId: 'bot-orion',
    authorName: 'Orion Dev',
    authorTag: '1337',
    authorAvatar: '🪐',
    authorGradient: 'from-cyan-500 to-blue-600',
    authorRoleColor: '#94A3B8',
    content: 'Testing out rich media previews & GIF cards in `#project-showcase`!',
    gif: CURATED_GIFS[1],
    pinned: false,
    reactions: { '🚀': ['bot-nova'] },
    createdAtMs: Date.now() - 1000 * 60 * 18
  },
  {
    id: 'seed-6',
    channelId: 'ch-lab-general',
    serverId: 'cyber-builders',
    authorId: 'bot-kaelen',
    authorName: 'Kaelen Vance',
    authorTag: '4042',
    authorAvatar: '🛡️',
    authorGradient: 'from-emerald-500 to-teal-600',
    authorRoleColor: '#F472B6',
    content: 'Welcome to **Synth & Code Lab**! Drop your shaders, WebAudio experiments, or custom servers here.',
    pinned: false,
    reactions: { '⚡': ['bot-nova'] },
    createdAtMs: Date.now() - 1000 * 60 * 30
  }
];

// ============================================================================
// UTILITY HELPERS (MARKDOWN PARSER & FORMATTERS)
// ============================================================================
function formatTimestamp(ms) {
  if (!ms) return 'Just now';
  const date = new Date(ms);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return isToday ? `Today at ${timeStr}` : `${date.toLocaleDateString()} ${timeStr}`;
}

function renderRichMarkdown(text) {
  if (!text) return null;
  // Split fenced code blocks ```lang ... ```
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'codeblock', lang: match[1] || 'code', content: match[2].trim() });
    lastIndex = codeBlockRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts.map((part, idx) => {
    if (part.type === 'codeblock') {
      return (
        <div key={idx} className="my-2 rounded-lg overflow-hidden border border-slate-700/80 bg-[#080B10] shadow-inner">
          <div className="px-3 py-1 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="uppercase tracking-wider text-indigo-400">{part.lang}</span>
            <span>CODE</span>
          </div>
          <pre className="p-3 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
            <code>{part.content}</code>
          </pre>
        </div>
      );
    }

    // Inline markdown: **bold**, *italic*, `code`, URLs
    const lines = part.content.split('\n');
    return (
      <div key={idx} className="space-y-1">
        {lines.map((line, lIdx) => {
          const tokens = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|https?:\/\/[^\s]+)/g);
          return (
            <p key={lIdx} className="leading-relaxed break-words">
              {tokens.map((tok, tIdx) => {
                if (tok.startsWith('**') && tok.endsWith('**') && tok.length > 4) {
                  return <strong key={tIdx} className="font-bold text-white">{tok.slice(2, -2)}</strong>;
                }
                if (tok.startsWith('*') && tok.endsWith('*') && tok.length > 2) {
                  return <em key={tIdx} className="italic text-slate-200">{tok.slice(1, -1)}</em>;
                }
                if (tok.startsWith('`') && tok.endsWith('`') && tok.length > 2) {
                  return (
                    <code key={tIdx} className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800/90 border border-slate-700/60 text-indigo-300 font-mono text-[13px]">
                      {tok.slice(1, -1)}
                    </code>
                  );
                }
                if (tok.startsWith('http://') || tok.startsWith('https://')) {
                  return (
                    <a
                      key={tIdx}
                      href={tok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                    >
                      {tok}
                    </a>
                  );
                }
                return <span key={tIdx}>{tok}</span>;
              })}
            </p>
          );
        })}
      </div>
    );
  });
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // ---------------- AUTH & USER PROFILE STATE ----------------
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashExiting, setSplashExiting] = useState(false);
  const [splashProgress, setSplashProgress] = useState(0);
  const [splashStepIndex, setSplashStepIndex] = useState(0);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [isGuestSession, setIsGuestSession] = useState(false);

  const [currentUserProfile, setCurrentUserProfile] = useState({
    uid: 'guest-user',
    displayName: 'Explorer',
    username: 'explorer',
    tag: '2026',
    avatarEmoji: '🚀',
    avatarUrl: '',
    avatarGradient: 'from-indigo-500 to-purple-600',
    banner: BANNER_GRADIENTS[0],
    status: 'online',
    customStatus: 'Exploring Origin!',
    bio: 'Building & chatting in real time on Origin.'
  });

  // ---------------- NAVIGATION & LAYOUT STATE ----------------
  const [viewMode, setViewMode] = useState('server'); // 'server' | 'dm'
  const [spatialSubView, setSpatialSubView] = useState('chat'); // 'chat' | 'voice'
  const [servers, setServers] = useState(DEFAULT_SERVERS_SEED);
  const [activeServerId, setActiveServerId] = useState('origin-hq');
  const [activeChannelId, setActiveChannelId] = useState('ch-general');
  const [activeDmId, setActiveDmId] = useState(null); // null -> Friends Dashboard, or dmThreadId
  const [friendsTab, setFriendsTab] = useState('online'); // 'online' | 'all' | 'pending' | 'blocked' | 'add'

  const [inspectorDrawerOpen, setInspectorDrawerOpen] = useState(true);
  const [inspectorTab, setInspectorTab] = useState('members'); // 'members' | 'pinned'
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);

  // ---------------- MESSAGING & REAL-TIME SYNC STATE ----------------
  const [firestoreMessages, setFirestoreMessages] = useState([]);
  const [localMessages, setLocalMessages] = useState(INITIAL_SEED_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const [showPinnedDrawer, setShowPinnedDrawer] = useState(false);
  const [activeReactionPickerMsgId, setActiveReactionPickerMsgId] = useState(null);

  // ---------------- FRIENDS & DIRECT MESSAGES STATE ----------------
  const [friendsList, setFriendsList] = useState([
    { uid: 'bot-nova', status: 'accepted' },
    { uid: 'bot-kaelen', status: 'accepted' },
    { uid: 'bot-lyra', status: 'accepted' },
    { uid: 'bot-orion', status: 'pending_incoming' }
  ]);
  const [blockedUids, setBlockedUids] = useState([]);
  const [addFriendInput, setAddFriendInput] = useState('');
  const [friendFeedback, setFriendFeedback] = useState(null);
  const [dmThreads, setDmThreads] = useState([
    {
      id: 'dm-nova',
      isGroup: false,
      name: 'Nova Architect',
      participantIds: ['bot-nova'],
      unread: 1
    },
    {
      id: 'dm-group-founders',
      isGroup: true,
      name: 'Core Design & Dev Sync',
      participantIds: ['bot-nova', 'bot-lyra', 'bot-kaelen'],
      unread: 0
    }
  ]);

  // ---------------- VOICE, VIDEO & SCREEN SHARE STATE ----------------
  const [connectedVoiceChannel, setConnectedVoiceChannel] = useState(null); // { serverId, channelId, channelName }
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [pushToTalkMode, setPushToTalkMode] = useState(false);
  const [isPttPressed, setIsPttPressed] = useState(false);
  const [speakingUsers, setSpeakingUsers] = useState({});
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [mediaNotice, setMediaNotice] = useState('');

  const videoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const chatBottomRef = useRef(null);

  // ---------------- MODALS & POPOVERS STATE ----------------
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [showUserSettingsModal, setShowUserSettingsModal] = useState(false);
  const [showServerSettingsModal, setShowServerSettingsModal] = useState(false);
  const [serverSettingsTab, setServerSettingsTab] = useState('overview'); // 'overview' | 'roles' | 'members'
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const [showDiscoverModal, setShowDiscoverModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showCreateGroupDmModal, setShowCreateGroupDmModal] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);
  const toastNotificationTimerRef = useRef(null);
  const splashTimersRef = useRef([]);

  const SPLASH_TELEMETRY_STEPS = [
    'Calibrating spatial glass...',
    'Syncing real-time channels...',
    'Ready'
  ];

  // ---------------- TOAST HELPER ----------------
  const triggerToast = (title, description = '', type = 'info') => {
    setToastNotification({ id: Date.now(), title, description, type });
  };

  useEffect(() => {
    return () => {
      if (toastNotificationTimerRef.current) clearTimeout(toastNotificationTimerRef.current);
      splashTimersRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  // Fast, snappy Spatial / Glassmorphic loading screen progression (~1.2s total)
  const startSpatialSplash = () => {
    splashTimersRef.current.forEach((id) => clearTimeout(id));
    splashTimersRef.current = [];
    setSplashExiting(false);
    setSplashVisible(true);
    setSplashProgress(14);
    setSplashStepIndex(0);

    const t1 = setTimeout(() => {
      setSplashProgress(56);
      setSplashStepIndex(1);
    }, 360);

    const t2 = setTimeout(() => {
      setSplashProgress(100);
      setSplashStepIndex(2);
    }, 780);

    const t3 = setTimeout(() => {
      setSplashExiting(true);
    }, 1020);

    const t4 = setTimeout(() => {
      setSplashVisible(false);
      setSplashExiting(false);
    }, 1340);

    splashTimersRef.current = [t1, t2, t3, t4];
  };

  const dismissSpatialSplash = () => {
    if (!splashVisible || splashExiting) return;
    splashTimersRef.current.forEach((id) => clearTimeout(id));
    splashTimersRef.current = [];
    setSplashProgress(100);
    setSplashStepIndex(SPLASH_TELEMETRY_STEPS.length - 1);
    setSplashExiting(true);
    const finishTimer = setTimeout(() => {
      setSplashVisible(false);
      setSplashExiting(false);
    }, 240);
    splashTimersRef.current = [finishTimer];
  };

  useEffect(() => {
    startSpatialSplash();
  }, []);

  // ============================================================================
  // FIREBASE AUTH LIFECYCLE (RULE 3: AUTH BEFORE QUERIES)
  // ============================================================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (err) {
        console.warn('Initial custom token auth skipped:', err.message);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsGuestSession(false);
        const generatedTag = String((user.uid.charCodeAt(0) * 37 + user.uid.length * 19) % 9000 + 1000);
        const baseName = user.displayName || (user.email ? user.email.split('@')[0] : 'OriginUser');
        const cleanUsername = baseName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user';

        // Load or create user profile in Firestore
        try {
          const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main');
          const snap = await getDoc(profileRef);
          if (snap.exists()) {
            setCurrentUserProfile((prev) => ({ ...prev, ...snap.data(), uid: user.uid }));
          } else {
            const newProfile = {
              uid: user.uid,
              displayName: baseName,
              username: cleanUsername,
              tag: generatedTag,
              avatarEmoji: '⚡',
              avatarUrl: user.photoURL || '',
              avatarGradient: 'from-indigo-500 to-purple-600',
              banner: BANNER_GRADIENTS[0],
              status: 'online',
              customStatus: 'Ready to chat on Origin',
              bio: 'Member of the Origin real-time community.'
            };
            setCurrentUserProfile(newProfile);
            await setDoc(profileRef, newProfile);
          }
        } catch (err) {
          // Graceful fallback if Firestore permissions are restricted in demo mode
          setCurrentUserProfile((prev) => ({
            ...prev,
            uid: user.uid,
            displayName: baseName,
            username: cleanUsername,
            tag: generatedTag
          }));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // ============================================================================
  // FIRESTORE REAL-TIME MESSAGES LISTENER (RULES 1, 2, 3)
  // ============================================================================
  useEffect(() => {
    if (!firebaseUser) return;

    const messagesCol = collection(db, 'artifacts', appId, 'public', 'data', 'messages');
    const unsubscribe = onSnapshot(
      messagesCol,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }));
        setFirestoreMessages(fetched);
      },
      (error) => {
        console.warn('Firestore messages sync fallback active:', error.message);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  // ============================================================================
  // AUTHENTICATION HANDLERS
  // ============================================================================
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthNotice('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
        triggerToast('Welcome back!', 'Signed in to Origin.');
      } else if (authMode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        if (authDisplayName.trim()) {
          await updateProfile(cred.user, { displayName: authDisplayName.trim() });
        }
        triggerToast('Account created!', 'Welcome to Origin.');
      } else if (authMode === 'reset') {
        await sendPasswordResetEmail(auth, authEmail);
        setAuthNotice('Password reset link sent! Check your inbox.');
      }
    } catch (err) {
      setAuthError(err.message.replace('Firebase:', '').trim());
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      triggerToast('Signed in with Google', 'Welcome to Origin!');
    } catch (err) {
      setAuthError(err.message.replace('Firebase:', '').trim());
    }
  };

  const handleGuestDemoLogin = async () => {
    setAuthError('');
    try {
      await signInAnonymously(auth);
      triggerToast('Connected as Demo User', 'Real-time cloud sync & voice stage unlocked.');
    } catch (err) {
      // Pure local instant fallback if anonymous auth is disabled on project
      setIsGuestSession(true);
      triggerToast('Instant Demo Mode', 'Running with full local & simulated real-time features.');
    }
  };

  const handleSignOut = async () => {
    try {
      if (firebaseUser) await signOut(auth);
    } catch (_) {}
    setIsGuestSession(false);
    setConnectedVoiceChannel(null);
    setShowUserSettingsModal(false);
    triggerToast('Signed out', 'See you next time on Origin.');
  };

  // ============================================================================
  // DERIVED ACTIVE SERVER, CHANNEL & ALL DIRECTORY USERS
  // ============================================================================
  const isAuthenticated = Boolean(firebaseUser || isGuestSession);

  const activeServer = useMemo(
    () => servers.find((s) => s.id === activeServerId) || servers[0],
    [servers, activeServerId]
  );

  const activeChannel = useMemo(
    () => activeServer?.channels.find((c) => c.id === activeChannelId) || activeServer?.channels[0],
    [activeServer, activeChannelId]
  );

  const activeDmThread = useMemo(
    () => dmThreads.find((d) => d.id === activeDmId) || null,
    [dmThreads, activeDmId]
  );

  const allDirectoryUsers = useMemo(() => {
    const map = new Map();
    COMMUNITY_MEMBERS_SEED.forEach((m) => map.set(m.uid, m));
    map.set(currentUserProfile.uid, {
      ...currentUserProfile,
      roleId: 'role-founder'
    });
    return Array.from(map.values());
  }, [currentUserProfile]);

  const getUserById = (uid) => {
    return (
      allDirectoryUsers.find((u) => u.uid === uid) || {
        uid,
        displayName: 'Origin Member',
        username: 'member',
        tag: '0000',
        avatarEmoji: '👤',
        avatarGradient: 'from-slate-600 to-slate-700',
        banner: BANNER_GRADIENTS[3],
        status: 'online',
        customStatus: '',
        bio: 'Origin community member.',
        roleId: 'role-member'
      }
    );
  };

  // Combine seeded/local messages with Firestore synced messages seamlessly
  const mergedMessages = useMemo(() => {
    const byId = new Map();
    localMessages.forEach((m) => byId.set(m.id, m));
    firestoreMessages.forEach((m) => byId.set(m.id, m));
    return Array.from(byId.values()).sort((a, b) => (a.createdAtMs || 0) - (b.createdAtMs || 0));
  }, [localMessages, firestoreMessages]);

  const currentConversationId = viewMode === 'server' ? activeChannel?.id : activeDmThread?.id;

  const currentFeedMessages = useMemo(() => {
    if (!currentConversationId) return [];
    return mergedMessages.filter((m) => {
      if (m.channelId !== currentConversationId) return false;
      if (blockedUids.includes(m.authorId)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchText = (m.content || '').toLowerCase().includes(q);
        const matchAuthor = (m.authorName || '').toLowerCase().includes(q);
        return matchText || matchAuthor;
      }
      return true;
    });
  }, [mergedMessages, currentConversationId, blockedUids, searchQuery]);

  const pinnedMessages = useMemo(
    () => mergedMessages.filter((m) => m.channelId === currentConversationId && m.pinned),
    [mergedMessages, currentConversationId]
  );

  // Auto-scroll chat feed on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentFeedMessages.length, currentConversationId]);

  // ============================================================================
  // SEND, EDIT, DELETE, PIN, REACT & SIMULATED LIVE BOT REPLY
  // ============================================================================
  const handleSendMessage = async (e, overrideGif = null) => {
    if (e) e.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed && !overrideGif && !attachmentUrl.trim()) return;
    if (!currentConversationId) return;

    // Check if announcement channel & user lacks permission
    if (viewMode === 'server' && activeChannel?.type === 'announcement') {
      const userRole = getMemberEffectiveRole(currentUserProfile.uid);
      if (!userRole?.permissions?.manageChannels && !userRole?.permissions?.manageServer) {
        triggerToast('Read-Only Channel', 'Only Founders & Moderators can post in announcement channels.', 'error');
        return;
      }
    }

    // Check timeout
    const serverTimeouts = timedOutUsersByServer[activeServer?.id] || [];
    if (viewMode === 'server' && serverTimeouts.includes(currentUserProfile.uid)) {
      triggerToast('Timed Out', 'You are temporarily muted in this server.', 'error');
      return;
    }

    const userRole = getMemberEffectiveRole(currentUserProfile.uid);
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      channelId: currentConversationId,
      serverId: viewMode === 'server' ? activeServer.id : 'dm',
      authorId: currentUserProfile.uid,
      authorName: currentUserProfile.displayName,
      authorTag: currentUserProfile.tag,
      authorAvatar: currentUserProfile.avatarEmoji,
      authorAvatarUrl: currentUserProfile.avatarUrl || '',
      authorGradient: currentUserProfile.avatarGradient,
      authorRoleColor: userRole?.color || '#818CF8',
      content: trimmed,
      attachmentUrl: attachmentUrl.trim() || null,
      gif: overrideGif || null,
      replyTo: replyingTo
        ? { id: replyingTo.id, authorName: replyingTo.authorName, content: replyingTo.content.slice(0, 80) }
        : null,
      pinned: false,
      reactions: {},
      createdAtMs: Date.now()
    };

    // Optimistic instant update
    setLocalMessages((prev) => [...prev, newMsg]);
    setMessageInput('');
    setReplyingTo(null);
    setAttachmentUrl('');
    setShowAttachmentInput(false);
    setShowGifPicker(false);
    setShowEmojiPicker(false);

    // Persist to Firestore when signed in
    if (firebaseUser) {
      try {
        const msgRef = doc(db, 'artifacts', appId, 'public', 'data', 'messages', newMsg.id);
        await setDoc(msgRef, { ...newMsg, serverTimestamp: serverTimestamp() });
      } catch (err) {
        console.warn('Saved locally (Firestore write skipped):', err.message);
      }
    }

    // Simulate realistic real-time community response in #general or DMs
    if (
      (viewMode === 'server' && activeChannel?.id === 'ch-general') ||
      viewMode === 'dm'
    ) {
      const responder =
        viewMode === 'dm' && activeDmThread
          ? getUserById(activeDmThread.participantIds[0])
          : COMMUNITY_MEMBERS_SEED[Math.floor(Math.random() * 3)];

      setTimeout(() => {
        setTypingUsers([responder.displayName]);
      }, 650);

      setTimeout(async () => {
        setTypingUsers([]);
        const smartReplies = [
          `Love that! Real-time sync is looking super clean on **Origin** 🔥`,
          `Agreed, @${currentUserProfile.username}! Let's test screen sharing in the Voice Lounge right after this.`,
          `Just saw that come through instantaneously—zero latency! 🚀`,
          `Great point! Pinned or reacted so the rest of the squad sees it ✨`
        ];
        const replyMsg = {
          id: `msg-bot-${Date.now()}`,
          channelId: currentConversationId,
          serverId: viewMode === 'server' ? activeServer.id : 'dm',
          authorId: responder.uid,
          authorName: responder.displayName,
          authorTag: responder.tag,
          authorAvatar: responder.avatarEmoji,
          authorGradient: responder.avatarGradient,
          authorRoleColor: '#34D399',
          replyTo: {
            id: newMsg.id,
            authorName: currentUserProfile.displayName,
            content: (trimmed || overrideGif?.title || 'Media attachment').slice(0, 70)
          },
          content: smartReplies[Math.floor(Math.random() * smartReplies.length)],
          pinned: false,
          reactions: {},
          createdAtMs: Date.now()
        };
        setLocalMessages((prev) => [...prev, replyMsg]);
      }, 2200);
    }
  };

  const handleSaveEditMessage = async (msgId) => {
    if (!editDraft.trim()) return;
    setLocalMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, content: editDraft.trim(), edited: true } : m))
    );
    setEditingMessageId(null);
    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'messages', msgId), {
          content: editDraft.trim(),
          edited: true
        });
      } catch (_) {}
    }
  };

  const handleDeleteMessage = async (msgId) => {
    setLocalMessages((prev) => prev.filter((m) => m.id !== msgId));
    setFirestoreMessages((prev) => prev.filter((m) => m.id !== msgId));
    if (firebaseUser) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'messages', msgId));
      } catch (_) {}
    }
    triggerToast('Message deleted');
  };

  const handleTogglePinMessage = async (msg) => {
    const nextPinned = !msg.pinned;
    setLocalMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, pinned: nextPinned } : m))
    );
    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'messages', msg.id), {
          pinned: nextPinned
        });
      } catch (_) {}
    }
    triggerToast(nextPinned ? 'Message pinned to channel' : 'Message unpinned');
  };

  const handleToggleReaction = async (msg, emoji) => {
    const currentReactions = { ...(msg.reactions || {}) };
    const users = currentReactions[emoji] || [];
    const uid = currentUserProfile.uid;
    if (users.includes(uid)) {
      currentReactions[emoji] = users.filter((u) => u !== uid);
      if (currentReactions[emoji].length === 0) delete currentReactions[emoji];
    } else {
      currentReactions[emoji] = [...users, uid];
    }

    setLocalMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, reactions: currentReactions } : m))
    );
    setActiveReactionPickerMsgId(null);

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'messages', msg.id), {
          reactions: currentReactions
        });
      } catch (_) {}
    }
  };

  // ============================================================================
  // VOICE, VIDEO, SCREEN SHARE & SPEAKING DETECTION
  // ============================================================================
  const joinVoiceChannel = (server, channel) => {
    setConnectedVoiceChannel({
      serverId: server.id,
      serverName: server.name,
      channelId: channel.id,
      channelName: channel.name
    });
    setSpatialSubView('voice');
    triggerToast(`Connected to ${channel.name}`, 'Spatial Voice, Video & Screen Sharing stage active.');
  };

  const disconnectVoiceChannel = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
    }
    setIsCameraOn(false);
    setIsScreenSharing(false);
    setConnectedVoiceChannel(null);
    setSpatialSubView('chat');
    triggerToast('Disconnected from Spatial Voice');
  };

  const disconnectVoiceChannel = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
    }
    setIsCameraOn(false);
    setIsScreenSharing(false);
    setConnectedVoiceChannel(null);
    triggerToast('Disconnected from Voice');
  };

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      setIsCameraOn(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setCameraStream(stream);
      setIsCameraOn(true);
      setMediaNotice('');
    } catch (err) {
      // Simulated camera active fallback when hardware/permission unavailable in sandbox
      setIsCameraOn(true);
      setMediaNotice('Simulated camera feed active (browser camera permission unavailable).');
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      stream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        setScreenStream(null);
      };
      setScreenStream(stream);
      setIsScreenSharing(true);
      setMediaNotice('');
    } catch (err) {
      // Simulated interactive screen share preview fallback
      setIsScreenSharing(true);
      setMediaNotice('Simulated Screen Share Stage active.');
    }
  };

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, isCameraOn]);

  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream, isScreenSharing]);

  // Push-to-talk Spacebar listener when connected to voice
  useEffect(() => {
    if (!connectedVoiceChannel || !pushToTalkMode) return;
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsPttPressed(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsPttPressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [connectedVoiceChannel, pushToTalkMode]);

  // Simulated & real speaking indicator ring while in Voice Channel
  useEffect(() => {
    if (!connectedVoiceChannel) {
      setSpeakingUsers({});
      return;
    }
    const interval = setInterval(() => {
      const userCanSpeak = !isMuted && !isDeafened && (!pushToTalkMode || isPttPressed);
      setSpeakingUsers({
        [currentUserProfile.uid]: userCanSpeak && Math.random() > 0.35,
        'bot-kaelen': Math.random() > 0.55,
        'bot-lyra': Math.random() > 0.72
      });
    }, 900);
    return () => clearInterval(interval);
  }, [connectedVoiceChannel, isMuted, isDeafened, pushToTalkMode, isPttPressed, currentUserProfile.uid]);

  // ============================================================================
  // ROLES, PERMISSIONS & MODERATION HELPERS
  // ============================================================================
  const getMemberEffectiveRole = (uid) => {
    if (!activeServer) return null;
    const overrideKey = `${activeServer.id}:${uid}`;
    const userObj = getUserById(uid);
    const roleId = memberRoleOverrides[overrideKey] || userObj.roleId || activeServer.roles[activeServer.roles.length - 1]?.id;
    return activeServer.roles.find((r) => r.id === roleId) || activeServer.roles[activeServer.roles.length - 1];
  };

  const currentUserRole = getMemberEffectiveRole(currentUserProfile.uid);
  const canManageServer = Boolean(currentUserRole?.permissions?.manageServer);
  const canManageChannels = Boolean(currentUserRole?.permissions?.manageChannels || canManageServer);
  const canKickBan = Boolean(currentUserRole?.permissions?.kickBan || canManageServer);
  const canManageMessages = Boolean(currentUserRole?.permissions?.manageMessages || canManageServer);

  const visibleServerMembers = useMemo(() => {
    if (!activeServer) return [];
    const kicked = kickedUsersByServer[activeServer.id] || [];
    const banned = bannedUsersByServer[activeServer.id] || [];
    return allDirectoryUsers.filter((u) => !kicked.includes(u.uid) && !banned.includes(u.uid));
  }, [activeServer, allDirectoryUsers, kickedUsersByServer, bannedUsersByServer]);

  const handleModAction = (action, targetUser) => {
    if (!activeServer || targetUser.uid === currentUserProfile.uid) return;
    if (action === 'kick') {
      setKickedUsersByServer((prev) => ({
        ...prev,
        [activeServer.id]: [...(prev[activeServer.id] || []), targetUser.uid]
      }));
      triggerToast(`Kicked ${targetUser.displayName}`, `Removed from ${activeServer.name}.`);
    } else if (action === 'ban') {
      setBannedUsersByServer((prev) => ({
        ...prev,
        [activeServer.id]: [...(prev[activeServer.id] || []), targetUser.uid]
      }));
      triggerToast(`Banned ${targetUser.displayName}`, `Permanently banned from ${activeServer.name}.`, 'error');
    } else if (action === 'timeout') {
      setTimedOutUsersByServer((prev) => {
        const list = prev[activeServer.id] || [];
        const exists = list.includes(targetUser.uid);
        return {
          ...prev,
          [activeServer.id]: exists ? list.filter((id) => id !== targetUser.uid) : [...list, targetUser.uid]
        };
      });
      triggerToast(`Updated timeout for ${targetUser.displayName}`);
    }
    setSelectedProfileUser(null);
  };

  // ============================================================================
  // FRIENDS & DM ACTIONS
  // ============================================================================
  const openOrCreateDirectMessage = (targetUser) => {
    setViewMode('dm');
    setSpatialSubView('chat');
    setSelectedProfileUser(null);
    const existing = dmThreads.find((d) => !d.isGroup && d.participantIds.includes(targetUser.uid));
    if (existing) {
      setActiveDmId(existing.id);
      setDmThreads((prev) => prev.map((t) => (t.id === existing.id ? { ...t, unread: 0 } : t)));
      return;
    }
    const newThread = {
      id: `dm-${targetUser.uid}-${Date.now()}`,
      isGroup: false,
      name: targetUser.displayName,
      participantIds: [targetUser.uid],
      unread: 0
    };
    setDmThreads((prev) => [newThread, ...prev]);
    setActiveDmId(newThread.id);
  };

  const handleSendFriendRequest = (e) => {
    e.preventDefault();
    const raw = addFriendInput.trim().toLowerCase();
    if (!raw) return;
    const found = COMMUNITY_MEMBERS_SEED.find(
      (u) => `${u.username}#${u.tag}`.toLowerCase() === raw || u.username.toLowerCase() === raw
    );
    if (!found) {
      setFriendFeedback({ type: 'error', text: `Could not find user "${addFriendInput}". Try soren#9010 or nova#0001.` });
      return;
    }
    if (friendsList.some((f) => f.uid === found.uid)) {
      setFriendFeedback({ type: 'info', text: `You already have a connection or pending request with ${found.displayName}.` });
      return;
    }
    setFriendsList((prev) => [...prev, { uid: found.uid, status: 'pending_outgoing' }]);
    setFriendFeedback({ type: 'success', text: `Friend request sent to ${found.displayName}#${found.tag}!` });
    setAddFriendInput('');
  };

  // ============================================================================
  // RENDER: AUTHENTICATION GATEWAY SCREEN (GLASSMORPHIC COSMIC THEME)
  // ============================================================================
  const spatialLoadingOverlay = splashVisible ? (
    <div
      role="dialog"
      aria-label="Loading Origin Spatial Hub"
      onClick={dismissSpatialSplash}
      title="Click anywhere to enter immediately"
      className={`fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-[#070913] via-[#0B1021] to-[#0F152B] text-slate-100 cursor-pointer transition-all duration-300 ease-out ${
        splashExiting
          ? 'opacity-0 scale-105 blur-md pointer-events-none'
          : 'opacity-100 scale-100 blur-0'
      }`}
    >
      {/* Cosmic Nebula & Aurora Radial Blooms */}
      <div className="absolute -top-36 -left-32 w-[520px] h-[520px] rounded-full bg-indigo-600/25 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-[480px] h-[480px] rounded-full bg-cyan-500/20 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-36 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-600/25 blur-[130px] pointer-events-none" />

      {/* Fine Spatial Grid & Floating Particle Accents */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(rgba(148, 163, 184, 0.28) 1px, transparent 1px), linear-gradient(to right, rgba(99, 102, 241, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 211, 238, 0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px, 84px 84px, 84px 84px'
        }}
      />
      <span className="absolute top-[22%] left-[18%] w-2 h-2 rounded-full bg-cyan-400/70 blur-[1px] animate-ping pointer-events-none" />
      <span className="absolute bottom-[24%] right-[20%] w-2.5 h-2.5 rounded-full bg-indigo-400/70 blur-[1px] animate-pulse pointer-events-none" />
      <span className="absolute top-[30%] right-[28%] w-1.5 h-1.5 rounded-full bg-violet-300/80 animate-ping pointer-events-none" />

      {/* Centered Frosted-Glass Spatial Emblem & Telemetry Card */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          dismissSpatialSplash();
        }}
        className="relative w-full max-w-md rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/15 shadow-[0_24px_90px_rgba(0,0,0,0.75)] px-7 py-8 flex flex-col items-center text-center"
      >
        {/* Orbital Gradient Rings & Glowing Core Mark */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          {/* Outer Rotating Conic / Gradient Ring */}
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              animationDuration: '3.2s',
              background:
                'conic-gradient(from 0deg, rgba(34, 211, 238, 0.85), rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.85), rgba(34, 211, 238, 0.1))',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))'
            }}
          />

          {/* Counter-Rotating Inner Glass Ring */}
          <div
            className="absolute inset-2.5 rounded-full border border-dashed border-cyan-300/40 animate-spin"
            style={{ animationDuration: '5s', animationDirection: 'reverse' }}
          />

          {/* Subtle Shimmer Pulse Halo */}
          <div className="absolute inset-4 rounded-full bg-indigo-500/20 blur-md animate-pulse" />

          {/* Frosted Glass Core Mark */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/90 via-indigo-500/90 to-violet-600/90 border border-white/30 shadow-[0_0_35px_rgba(99,102,241,0.55)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full animate-pulse" />
            <span className="relative text-3xl font-black tracking-tight text-white drop-shadow">
              O
            </span>
          </div>
        </div>

        {/* Typographic Reveal */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-300/25 text-[11px] font-mono font-semibold tracking-[0.22em] text-cyan-300 uppercase mb-2.5">
          <Sparkles className="w-3 h-3 text-cyan-300" />
          <span>ORIGIN // SPATIAL HUB</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Origin
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-Time Chat, Spatial Voice & Community Glass
        </p>

        {/* Rapid Status Telemetry + Percentage Readout */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-200/90 truncate">
              {SPLASH_TELEMETRY_STEPS[splashStepIndex]}
            </span>
            <span className="text-slate-300 font-bold tabular-nums ml-2">
              {splashProgress}%
            </span>
          </div>

          {/* Glowing Glass Progress Bar */}
          <div className="w-full h-2 rounded-full bg-white/[0.07] border border-white/10 overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 shadow-[0_0_16px_rgba(34,211,238,0.75)] transition-all duration-300 ease-out"
              style={{ width: `${splashProgress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={dismissSpatialSplash}
          className="mt-5 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          Click anywhere to skip →
        </button>
      </div>
    </div>
  ) : null;

  if (authLoading) {
    return (
      <>
        {spatialLoadingOverlay}
        <div className="h-screen w-screen bg-gradient-to-br from-[#070913] via-[#0B1021] to-[#0F152B] flex flex-col items-center justify-center text-slate-200">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-black text-white shadow-2xl shadow-indigo-500/40 animate-pulse">
            O
          </div>
          <p className="mt-4 text-sm text-slate-400 tracking-wide">Initializing Origin Spatial Hub...</p>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {spatialLoadingOverlay}
        <div className="min-h-screen w-full bg-gradient-to-br from-[#070913] via-[#0B1021] to-[#0F152B] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
            className="mt-3 w-full py-2.5 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 font-medium text-sm border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span className="font-bold text-cyan-400">G</span>
            Continue with Google OAuth
          </button>

          <div className="mt-5 text-center text-xs text-slate-400">
            {authMode === 'login' ? (
              <>
                Need an Origin account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-cyan-400 hover:underline font-medium cursor-pointer"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-cyan-400 hover:underline font-medium cursor-pointer"
                >
                  Back to Login
                </button>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // ============================================================================
  // RENDER: GLASSMORPHIC / SPATIAL HUB WORKSPACE
  // ============================================================================
  const totalUnreadDms = dmThreads.reduce((acc, t) => acc + (t.unread || 0), 0);
  const firstVoiceChannelInServer = activeServer?.channels.find((c) => c.type === 'voice');

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#070913] via-[#0B1021] to-[#0F152B] text-slate-100 flex flex-col p-2.5 sm:p-4 gap-2.5 sm:gap-3 select-none relative">
      {spatialLoadingOverlay}
      {/* Ambient Cosmic Aurora Glow Orbs */}
      <div className="fixed -top-40 -left-40 w-[520px] h-[520px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/4 -right-40 w-[480px] h-[480px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* ========================================================================
          1. FLOATING TOP SPATIAL BAR
         ======================================================================== */}
      <header className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 py-2 rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-between gap-2 sm:gap-3 z-30 shrink-0">
        {/* Left: Origin Brand Orb & Workspace Switcher Dropdown */}
        <div className="flex items-center gap-2.5 min-w-0 relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-500/30 shrink-0">
            O
          </div>

          <button
            type="button"
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center gap-2 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer max-w-[200px] sm:max-w-[240px]"
          >
            <span className="text-base shrink-0">
              {viewMode === 'dm' ? '💬' : activeServer?.icon}
            </span>
            <span className="truncate">
              {viewMode === 'dm' ? 'Direct Messages Hub' : activeServer?.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${workspaceDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Workspace Switcher Popover */}
          {workspaceDropdownOpen && (
            <div className="absolute top-12 left-0 w-72 rounded-2xl bg-[#0D1224]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-2 z-50 space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Spatial Workspaces
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewMode('dm');
                  setSpatialSubView('chat');
                  setWorkspaceDropdownOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'dm' ? 'bg-indigo-500/25 text-white border border-indigo-400/30' : 'text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  Direct Messages & Friends
                </span>
                {totalUnreadDms > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {totalUnreadDms}
                  </span>
                )}
              </button>

              <div className="border-t border-white/10 my-1" />

              {servers.map((srv) => (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => {
                    setViewMode('server');
                    setActiveServerId(srv.id);
                    const firstText = srv.channels.find((c) => c.type !== 'voice') || srv.channels[0];
                    if (firstText) setActiveChannelId(firstText.id);
                    setSpatialSubView('chat');
                    setWorkspaceDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                    viewMode === 'server' && activeServer?.id === srv.id
                      ? 'bg-indigo-500/25 text-white border border-indigo-400/30'
                      : 'text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="text-base">{srv.icon}</span>
                  <span className="truncate flex-1 text-left">{srv.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{srv.inviteCode}</span>
                </button>
              ))}

              <div className="border-t border-white/10 my-1" />

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateServerModal(true);
                    setWorkspaceDropdownOpen(false);
                  }}
                  className="px-2.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> New Origin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDiscoverModal(true);
                    setWorkspaceDropdownOpen(false);
                  }}
                  className="px-2.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" /> Discover
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center: Quick View Switcher Pills + Global Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-black/25 p-1 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              setViewMode('server');
              setSpatialSubView('chat');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'server' && spatialSubView === 'chat'
                ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 text-white border border-cyan-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hash className="w-3.5 h-3.5 text-cyan-400" />
            Chat Stream
          </button>

          <button
            type="button"
            onClick={() => {
              if (!connectedVoiceChannel && firstVoiceChannelInServer) {
                joinVoiceChannel(activeServer, firstVoiceChannelInServer);
              } else {
                setViewMode('server');
                setSpatialSubView('voice');
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'server' && spatialSubView === 'voice'
                ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-white border border-emerald-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${connectedVoiceChannel ? 'text-emerald-400 animate-pulse' : 'text-indigo-400'}`} />
            Spatial Voice Stage
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('server');
              setInspectorDrawerOpen(true);
              setInspectorTab('members');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'server' && inspectorDrawerOpen && inspectorTab === 'members'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-violet-400" />
            Members & Roles
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('dm');
              setSpatialSubView('chat');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'dm'
                ? 'bg-gradient-to-r from-indigo-500/30 to-violet-500/30 text-white border border-indigo-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            Friends & DMs
          </button>
        </div>

        {/* Right: Global Search + User Profile Pill & Audio Controls */}
        <div className="flex items-center gap-2">
          <div className="relative hidden xl:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages... (⌘K)"
              className="w-44 focus:w-56 transition-all pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/60"
            />
          </div>

          {/* Frosted User Profile & Quick Audio Pill */}
          <div className="flex items-center gap-1 pl-1.5 pr-1 py-1 rounded-2xl bg-white/[0.05] border border-white/10">
            <button
              type="button"
              onClick={() => setShowUserSettingsModal(true)}
              className="flex items-center gap-2 pr-2 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <div className="relative">
                <div
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${currentUserProfile.avatarGradient} flex items-center justify-center text-xs font-bold text-white overflow-hidden`}
                >
                  {currentUserProfile.avatarUrl ? (
                    <img src={currentUserProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    currentUserProfile.avatarEmoji
                  )}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0B1021] ${
                    STATUS_CONFIG[currentUserProfile.status]?.color || 'bg-emerald-500'
                  }`}
                />
              </div>
              <div className="hidden sm:block text-left max-w-[110px]">
                <div className="text-xs font-bold text-white truncate leading-tight">
                  {currentUserProfile.displayName}
                </div>
                <div className="text-[10px] text-cyan-300/80 truncate leading-tight">
                  {currentUserProfile.customStatus || STATUS_CONFIG[currentUserProfile.status]?.label}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isMuted ? 'bg-rose-500/25 text-rose-300' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsDeafened(!isDeafened)}
              title={isDeafened ? 'Undeafen' : 'Deafen'}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isDeafened ? 'bg-rose-500/25 text-rose-300' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowUserSettingsModal(true)}
              title="Profile & Presence Settings"
              className="p-1.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={startSpatialSplash}
              title="Replay Spatial Loading Screen"
              className="px-2 py-1 rounded-xl text-[10px] font-mono font-bold text-cyan-300 hover:bg-cyan-400/15 border border-cyan-400/20 transition-colors cursor-pointer hidden sm:inline-flex items-center"
            >
              SPLASH
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================
          2. FLOATING CHANNEL PILL STRIP / SUB-HEADER
         ======================================================================== */}
      <div className="w-full max-w-[1600px] mx-auto px-3 py-1.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0 z-20">
        {viewMode === 'server' && activeServer ? (
          <>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {activeServer.categories.map((cat) => {
                const catChannels = activeServer.channels.filter((c) => c.categoryId === cat.id);
                return (
                  <div key={cat.id} className="flex items-center gap-1.5 pr-2 mr-1 border-r border-white/10 last:border-r-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1.5 hidden lg:inline">
                      {cat.name}
                    </span>
                    {catChannels.map((ch) => {
                      const isSelected = ch.type !== 'voice' && activeChannel?.id === ch.id && spatialSubView === 'chat';
                      const isVoiceActive =
                        ch.type === 'voice' &&
                        connectedVoiceChannel?.channelId === ch.id &&
                        connectedVoiceChannel?.serverId === activeServer.id;

                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            if (ch.type === 'voice') {
                              joinVoiceChannel(activeServer, ch);
                            } else {
                              setActiveChannelId(ch.id);
                              setSpatialSubView('chat');
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-indigo-500/30 to-violet-500/25 text-white border border-indigo-400/40 shadow-sm'
                              : isVoiceActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                              : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border border-white/5'
                          }`}
                        >
                          {ch.type === 'announcement' ? (
                            <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                          ) : ch.type === 'voice' ? (
                            <Volume2 className={`w-3.5 h-3.5 ${isVoiceActive ? 'text-emerald-400 animate-pulse' : 'text-cyan-400'}`} />
                          ) : (
                            <Hash className="w-3.5 h-3.5 text-indigo-400" />
                          )}
                          <span>{ch.name}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}

              {canManageChannels && (
                <button
                  type="button"
                  onClick={() => setShowCreateChannelModal(true)}
                  title="Create Channel"
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-indigo-500/25 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1 whitespace-nowrap transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Channel</span>
                </button>
              )}
            </div>

            {/* Right Actions on Channel Strip */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(activeServer.inviteCode);
                  triggerToast('Invite Link Copied!', `Code: ${activeServer.inviteCode}`);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/25 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Invite</span>
              </button>

              <button
                type="button"
                onClick={() => setShowServerSettingsModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-violet-400" />
                <span className="hidden sm:inline">Roles & Settings</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectorDrawerOpen(!inspectorDrawerOpen)}
                title="Toggle Right Spatial Inspector"
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                  inspectorDrawerOpen
                    ? 'bg-indigo-500/25 border-indigo-400/40 text-white'
                    : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* DM MODE PILL STRIP */
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveDmId(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeDmId === null
                    ? 'bg-indigo-500/30 text-white border border-indigo-400/40'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Friends Hub</span>
              </button>

              {dmThreads.map((thread) => {
                const primaryUser = getUserById(thread.participantIds[0]);
                const isSelected = activeDmId === thread.id;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => {
                      setActiveDmId(thread.id);
                      setDmThreads((prev) =>
                        prev.map((t) => (t.id === thread.id ? { ...t, unread: 0 } : t))
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/30 text-white border border-indigo-400/40'
                        : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/5'
                    }`}
                  >
                    <span>{thread.isGroup ? '👥' : primaryUser.avatarEmoji}</span>
                    <span>{thread.name}</span>
                    {thread.unread > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] font-bold text-white">
                        {thread.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowCreateGroupDmModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Group DM</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================
          3. MAIN SPATIAL WORKSPACE (FLOATING GLASS CARDS + SLIDE-OVER INSPECTOR)
         ======================================================================== */}
      <div className="w-full max-w-[1600px] mx-auto flex-1 min-h-0 flex gap-3 pb-16 sm:pb-20 z-10">
        {/* PRIMARY FLOATING GLASS CARD */}
        <main className="flex-1 min-w-0 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.45)] flex flex-col overflow-hidden relative">
          {/* Card Sub-Header */}
          <div className="px-4 sm:px-6 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {viewMode === 'server' && spatialSubView === 'voice' ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h2 className="font-bold text-sm sm:text-base text-white truncate">
                    {connectedVoiceChannel?.channelName || firstVoiceChannelInServer?.name || 'Spatial Voice Stage'}
                  </h2>
                  <span className="hidden sm:inline-block text-xs text-emerald-300/80 bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
                    Spatial Audio & Screen Stage
                  </span>
                </>
              ) : viewMode === 'server' && activeChannel ? (
                <>
                  {activeChannel.type === 'announcement' ? (
                    <Megaphone className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Hash className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                  <h2 className="font-bold text-sm sm:text-base text-white truncate">
                    {activeChannel.name}
                  </h2>
                  {activeChannel.topic && (
                    <span className="hidden lg:inline-block text-xs text-slate-400 border-l border-white/10 pl-3 truncate max-w-lg">
                      {activeChannel.topic}
                    </span>
                  )}
                </>
              ) : activeDmThread ? (
                <>
                  <AtSign className="w-4 h-4 text-cyan-400 shrink-0" />
                  <h2 className="font-bold text-sm sm:text-base text-white truncate">
                    {activeDmThread.name}
                  </h2>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                  <h2 className="font-bold text-sm sm:text-base text-white">Friends & Social Graph</h2>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {viewMode === 'server' && (
                <div className="flex md:hidden items-center gap-1 bg-black/30 p-0.5 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setSpatialSubView('chat')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                      spatialSubView === 'chat' ? 'bg-indigo-500 text-white' : 'text-slate-400'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!connectedVoiceChannel && firstVoiceChannelInServer) {
                        joinVoiceChannel(activeServer, firstVoiceChannelInServer);
                      } else {
                        setSpatialSubView('voice');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                      spatialSubView === 'voice' ? 'bg-emerald-500 text-white' : 'text-slate-400'
                    }`}
                  >
                    Voice
                  </button>
                </div>
              )}

              {(viewMode === 'server' || activeDmThread) && spatialSubView === 'chat' && (
                <button
                  type="button"
                  onClick={() => {
                    setInspectorDrawerOpen(true);
                    setInspectorTab('pinned');
                  }}
                  title="View Pinned Messages"
                  className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Pin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Pinned</span>
                  {pinnedMessages.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      {pinnedMessages.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ====================================================================
              VIEW A: GRID-BASED SPATIAL VOICE, VIDEO & SCREEN SHARING STAGE
             ==================================================================== */}
          {viewMode === 'server' && spatialSubView === 'voice' ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    {connectedVoiceChannel
                      ? `Connected to ${connectedVoiceChannel.channelName}`
                      : 'Previewing Spatial Stage'}
                  </span>
                  {pushToTalkMode && (
                    <span className="text-xs text-cyan-300 bg-cyan-500/15 border border-cyan-400/25 px-3 py-1 rounded-full">
                      Hold <strong>Spacebar</strong> to Talk {isPttPressed ? '• LIVE' : ''}
                    </span>
                  )}
                </div>
                {mediaNotice && <span className="text-xs text-amber-300">{mediaNotice}</span>}
              </div>

              {/* Spatial Participant Tiles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 items-stretch">
                {/* Screen Share Spatial Card */}
                {isScreenSharing && (
                  <div className="md:col-span-2 rounded-3xl bg-black/40 backdrop-blur-xl border-2 border-cyan-400/60 shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden relative flex flex-col items-center justify-center min-h-[220px]">
                    {screenStream ? (
                      <video ref={screenVideoRef} autoPlay playsInline muted className="w-full h-full max-h-80 object-contain bg-black" />
                    ) : (
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto mb-3">
                          <Monitor className="w-8 h-8 text-cyan-300 animate-pulse" />
                        </div>
                        <div className="text-sm font-bold text-white">
                          {currentUserProfile.displayName} is sharing their screen
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          1080p 60fps • Spatial WebRTC Ultra-Low Latency Stream
                        </div>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-500 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                      LIVE SCREEN SHARE
                    </span>
                  </div>
                )}

                {/* Current User Spatial Tile */}
                <div
                  className={`rounded-3xl bg-white/[0.04] backdrop-blur-xl border transition-all p-5 flex flex-col items-center justify-center relative min-h-[200px] ${
                    speakingUsers[currentUserProfile.uid]
                      ? 'border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.25)]'
                      : 'border-white/10'
                  }`}
                >
                  {isCameraOn && cameraStream ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-44 object-cover rounded-2xl" />
                  ) : (
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentUserProfile.avatarGradient} flex items-center justify-center text-3xl shadow-xl transition-all ${
                        speakingUsers[currentUserProfile.uid] ? 'ring-4 ring-emerald-400 scale-105' : ''
                      }`}
                    >
                      {currentUserProfile.avatarEmoji}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2 text-sm font-bold text-white">
                    <span>{currentUserProfile.displayName}</span>
                    {isMuted && <MicOff className="w-4 h-4 text-rose-400" />}
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5">
                    {isCameraOn ? 'Camera Active' : 'You'}
                  </span>
                </div>

                {/* Community Co-Hosts Spatial Tiles */}
                {[
                  { uid: 'bot-kaelen', name: 'Kaelen Vance', role: 'Moderator', emoji: '🛡️', grad: 'from-emerald-500 to-teal-600' },
                  { uid: 'bot-lyra', name: 'Lyra Chen', role: 'Design Lead', emoji: '🎨', grad: 'from-rose-500 to-pink-600' }
                ].map((peer) => (
                  <div
                    key={peer.uid}
                    className={`rounded-3xl bg-white/[0.04] backdrop-blur-xl border transition-all p-5 flex flex-col items-center justify-center relative min-h-[200px] ${
                      speakingUsers[peer.uid]
                        ? 'border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.25)]'
                        : 'border-white/10'
                    }`}
                  >
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${peer.grad} flex items-center justify-center text-3xl shadow-xl transition-all ${
                        speakingUsers[peer.uid] ? 'ring-4 ring-emerald-400 scale-105' : ''
                      }`}
                    >
                      {peer.emoji}
                    </div>
                    <div className="mt-3 text-sm font-bold text-white">{peer.name}</div>
                    <span className="text-xs text-slate-400 mt-0.5">{peer.role}</span>
                  </div>
                ))}
              </div>

              {/* Floating Spatial Media Control Bar */}
              <div className="mx-auto px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/15 flex flex-wrap items-center justify-center gap-2 shadow-2xl">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMuted ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-100'
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeafened(!isDeafened)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDeafened ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-100'
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  {isDeafened ? 'Undeafen' : 'Deafen'}
                </button>

                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCameraOn ? 'bg-indigo-500 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-100'
                  }`}
                >
                  {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  {isCameraOn ? 'Stop Video' : 'Camera'}
                </button>

                <button
                  type="button"
                  onClick={toggleScreenShare}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isScreenSharing ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/10 hover:bg-white/15 text-slate-100'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  {isScreenSharing ? 'Stop Share' : 'Share Screen'}
                </button>

                <button
                  type="button"
                  onClick={() => setPushToTalkMode(!pushToTalkMode)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    pushToTalkMode ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40' : 'bg-white/10 hover:bg-white/15 text-slate-200'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  {pushToTalkMode ? 'PTT: Spacebar' : 'Voice Activity'}
                </button>

                <button
                  type="button"
                  onClick={disconnectVoiceChannel}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  Leave Stage
                </button>
              </div>
            </div>
          ) : viewMode === 'dm' && !activeDmThread ? (
            /* ==================================================================
                VIEW B: FRIENDS & SOCIAL GRAPH HUB
               ================================================================== */
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 pb-4 mb-5 border-b border-white/10">
                {[
                  { id: 'online', label: 'Online' },
                  { id: 'all', label: 'All Friends' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'blocked', label: 'Blocked' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFriendsTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      friendsTab === tab.id
                        ? 'bg-white/15 text-white border border-white/15'
                        : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFriendsTab('add')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  + Add Friend
                </button>
              </div>

              {friendsTab === 'add' ? (
                <div className="max-w-lg">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
                    Add Friend on Origin
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Enter an Origin handle & tag (try <code className="text-cyan-300">soren#9010</code>).
                  </p>
                  <form onSubmit={handleSendFriendRequest} className="flex gap-2">
                    <input
                      type="text"
                      value={addFriendInput}
                      onChange={(e) => setAddFriendInput(e.target.value)}
                      placeholder="username#0000"
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold cursor-pointer"
                    >
                      Send Request
                    </button>
                  </form>
                  {friendFeedback && (
                    <p
                      className={`mt-3 text-xs ${
                        friendFeedback.type === 'error'
                          ? 'text-rose-400'
                          : friendFeedback.type === 'success'
                          ? 'text-emerald-400'
                          : 'text-cyan-300'
                      }`}
                    >
                      {friendFeedback.text}
                    </p>
                  )}
                </div>
              ) : friendsTab === 'blocked' ? (
                <div className="space-y-2.5 max-w-2xl">
                  {blockedUids.length === 0 ? (
                    <p className="text-xs text-slate-500 py-8 text-center">No blocked users.</p>
                  ) : (
                    blockedUids.map((uid) => {
                      const u = getUserById(uid);
                      return (
                        <div
                          key={uid}
                          className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${u.avatarGradient} flex items-center justify-center`}>
                              {u.avatarEmoji}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white">{u.displayName}</div>
                              <div className="text-xs text-slate-500">Blocked</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setBlockedUids((prev) => prev.filter((id) => id !== uid))}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 cursor-pointer"
                          >
                            Unblock
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
                  {friendsList
                    .filter((f) => {
                      const u = getUserById(f.uid);
                      if (friendsTab === 'online') return f.status === 'accepted' && u.status !== 'invisible';
                      if (friendsTab === 'all') return f.status === 'accepted';
                      if (friendsTab === 'pending') return f.status.startsWith('pending');
                      return true;
                    })
                    .map((f) => {
                      const u = getUserById(f.uid);
                      const st = STATUS_CONFIG[u.status] || STATUS_CONFIG.online;
                      return (
                        <div
                          key={f.uid}
                          className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 flex items-center justify-between transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative">
                              <div
                                className={`w-10 h-10 rounded-full bg-gradient-to-br ${u.avatarGradient} flex items-center justify-center text-lg`}
                              >
                                {u.avatarEmoji}
                              </div>
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0B1021] ${st.color}`}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-white truncate">{u.displayName}</span>
                                <span className="text-xs text-slate-500">#{u.tag}</span>
                              </div>
                              <div className="text-xs text-slate-400 truncate">
                                {f.status === 'pending_incoming'
                                  ? 'Incoming Friend Request'
                                  : f.status === 'pending_outgoing'
                                  ? 'Outgoing Friend Request'
                                  : u.customStatus || st.label}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {f.status === 'pending_incoming' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFriendsList((prev) =>
                                      prev.map((item) => (item.uid === f.uid ? { ...item, status: 'accepted' } : item))
                                    )
                                  }
                                  className="p-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFriendsList((prev) => prev.filter((item) => item.uid !== f.uid))}
                                  className="p-2 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : f.status === 'accepted' ? (
                              <button
                                type="button"
                                onClick={() => openOrCreateDirectMessage(u)}
                                className="p-2 rounded-full bg-white/10 hover:bg-cyan-500 text-slate-200 hover:text-slate-950 transition-colors cursor-pointer"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setFriendsList((prev) => prev.filter((item) => item.uid !== f.uid))}
                                className="px-2.5 py-1 rounded-xl bg-white/10 text-xs text-slate-300 hover:text-white cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          ) : (
            /* ==================================================================
                VIEW C: FLOATING CHAT STREAM & GLASS COMPOSER BAR
               ================================================================== */
            <>
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 select-text">
                {/* Spatial Channel Hero */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-cyan-500/10 border border-white/10 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-cyan-300">
                      {viewMode === 'server' ? <Hash className="w-6 h-6" /> : <AtSign className="w-6 h-6" />}
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-xl font-bold text-white">
                        Welcome to {viewMode === 'server' ? `#${activeChannel?.name}` : activeDmThread?.name}
                      </h1>
                      <p className="text-xs text-slate-300/80 mt-0.5">
                        {viewMode === 'server'
                          ? activeChannel?.topic || `Start of the #${activeChannel?.name} spatial stream.`
                          : `Encrypted direct message stream with ${activeDmThread?.name}.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Glass Message Bubbles/Cards */}
                {currentFeedMessages.map((msg) => {
                  const isOwn = msg.authorId === currentUserProfile.uid;
                  const authorObj = getUserById(msg.authorId);

                  return (
                    <div
                      key={msg.id}
                      className={`group relative flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                        msg.pinned
                          ? 'bg-amber-500/[0.07] border-amber-400/25'
                          : isOwn
                          ? 'bg-indigo-500/[0.08] border-indigo-400/20 hover:bg-indigo-500/[0.12]'
                          : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedProfileUser(authorObj)}
                        className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${
                          msg.authorGradient || 'from-indigo-500 to-purple-600'
                        } flex items-center justify-center text-lg shrink-0 mt-0.5 overflow-hidden cursor-pointer hover:ring-2 hover:ring-cyan-400 transition-all shadow-md`}
                      >
                        {msg.authorAvatarUrl ? (
                          <img src={msg.authorAvatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          msg.authorAvatar || '👤'
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        {msg.replyTo && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5 px-2.5 py-1 rounded-lg bg-black/25 border-l-2 border-cyan-400">
                            <Reply className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="font-semibold text-slate-200">@{msg.replyTo.authorName}</span>
                            <span className="truncate text-slate-400">{msg.replyTo.content}</span>
                          </div>
                        )}

                        <div className="flex items-baseline gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setSelectedProfileUser(authorObj)}
                            style={{ color: msg.authorRoleColor || '#FFFFFF' }}
                            className="font-bold text-sm hover:underline cursor-pointer"
                          >
                            {msg.authorName}
                          </button>
                          <span className="text-[11px] text-slate-500">{formatTimestamp(msg.createdAtMs)}</span>
                          {msg.edited && <span className="text-[10px] text-slate-500">(edited)</span>}
                          {msg.pinned && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 flex items-center gap-1">
                              <Pin className="w-2.5 h-2.5" /> Pinned
                            </span>
                          )}
                        </div>

                        {editingMessageId === msg.id ? (
                          <div className="mt-2 space-y-2">
                            <input
                              type="text"
                              value={editDraft}
                              onChange={(e) => setEditDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEditMessage(msg.id);
                                if (e.key === 'Escape') setEditingMessageId(null);
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-cyan-400 text-sm text-white focus:outline-none"
                              autoFocus
                            />
                            <div className="flex items-center gap-2 text-xs">
                              <button
                                type="button"
                                onClick={() => handleSaveEditMessage(msg.id)}
                                className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingMessageId(null)}
                                className="px-3 py-1 rounded-lg bg-white/10 text-slate-300 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-slate-200 mt-1">
                            {renderRichMarkdown(msg.content)}
                          </div>
                        )}

                        {msg.attachmentUrl && (
                          <div className="mt-2.5 max-w-sm rounded-2xl overflow-hidden border border-white/15 bg-black/30">
                            <img
                              src={msg.attachmentUrl}
                              alt="Attachment"
                              className="w-full max-h-64 object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        {msg.gif && (
                          <div
                            className={`mt-2.5 max-w-xs rounded-2xl bg-gradient-to-br ${msg.gif.bg} p-4 border border-white/20 shadow-lg`}
                          >
                            <div className="text-4xl mb-1">{msg.gif.emoji}</div>
                            <div className="text-xs font-black tracking-wider text-white uppercase">
                              {msg.gif.label}
                            </div>
                          </div>
                        )}

                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {Object.entries(msg.reactions).map(([emoji, users]) => {
                              const reacted = users.includes(currentUserProfile.uid);
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => handleToggleReaction(msg, emoji)}
                                  className={`px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1 border transition-all cursor-pointer ${
                                    reacted
                                      ? 'bg-cyan-500/25 border-cyan-400/50 text-cyan-200'
                                      : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/25'
                                  }`}
                                >
                                  <span>{emoji}</span>
                                  <span className="font-bold text-[11px]">{users.length}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Floating Glass Action Toolbar */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3 right-3 bg-[#0D1224]/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-xl flex items-center p-0.5 z-10">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveReactionPickerMsgId(activeReactionPickerMsgId === msg.id ? null : msg.id)
                          }
                          title="Add Reaction"
                          className="p-1.5 text-slate-300 hover:text-amber-300 hover:bg-white/10 rounded-lg cursor-pointer"
                        >
                          <Smile className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyingTo(msg)}
                          title="Reply"
                          className="p-1.5 text-slate-300 hover:text-cyan-300 hover:bg-white/10 rounded-lg cursor-pointer"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>
                        {(canManageMessages || isOwn) && (
                          <button
                            type="button"
                            onClick={() => handleTogglePinMessage(msg)}
                            title={msg.pinned ? 'Unpin' : 'Pin'}
                            className="p-1.5 text-slate-300 hover:text-amber-300 hover:bg-white/10 rounded-lg cursor-pointer"
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isOwn && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMessageId(msg.id);
                              setEditDraft(msg.content);
                            }}
                            title="Edit"
                            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {(isOwn || canManageMessages) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            title="Delete"
                            className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-white/10 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {activeReactionPickerMsgId === msg.id && (
                        <div className="absolute top-6 right-3 bg-[#0D1224]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-1.5 shadow-2xl flex gap-1 z-20">
                          {QUICK_EMOJIS.slice(0, 6).map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => handleToggleReaction(msg, em)}
                              className="w-7 h-7 hover:bg-white/10 rounded-xl flex items-center justify-center text-base cursor-pointer"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Typing Indicator */}
              <div className="h-5 px-6 text-xs text-cyan-300 flex items-center">
                {typingUsers.length > 0 && (
                  <span className="flex items-center gap-1.5 animate-pulse">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <strong>{typingUsers.join(', ')}</strong> is typing...
                  </span>
                )}
              </div>

              {/* Floating Glass Composer Bar */}
              <div className="px-4 sm:px-6 pb-4 pt-1 shrink-0 relative">
                {replyingTo && (
                  <div className="mb-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate">
                      Replying to <strong className="text-cyan-300">{replyingTo.authorName}</strong>:{' '}
                      {replyingTo.content}
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {showAttachmentInput && (
                  <div className="mb-2 px-3.5 py-2 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <input
                      type="url"
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      placeholder="Paste image URL to attach inline preview..."
                      className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowAttachmentInput(false);
                        setAttachmentUrl('');
                      }}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {showGifPicker && (
                  <div className="absolute bottom-16 right-6 w-72 sm:w-80 bg-[#0D1224]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-3 z-30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Spatial Reaction GIFs
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowGifPicker(false)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {CURATED_GIFS.map((gif) => (
                        <button
                          key={gif.id}
                          type="button"
                          onClick={() => handleSendMessage(null, gif)}
                          className={`p-3 rounded-xl bg-gradient-to-br ${gif.bg} text-left hover:scale-[1.02] transition-transform cursor-pointer`}
                        >
                          <div className="text-2xl">{gif.emoji}</div>
                          <div className="text-[10px] font-bold text-white mt-1 truncate">{gif.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {showEmojiPicker && (
                  <div className="absolute bottom-16 right-6 w-64 bg-[#0D1224]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-3 z-30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Emojis</span>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(false)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                      {QUICK_EMOJIS.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => {
                            setMessageInput((prev) => prev + em);
                            setShowEmojiPicker(false);
                          }}
                          className="h-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-lg cursor-pointer"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form
                  onSubmit={(e) => handleSendMessage(e)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/15 focus-within:border-cyan-400/70 transition-colors shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => setShowAttachmentInput(!showAttachmentInput)}
                    title="Attach Image URL"
                    className="p-1.5 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      viewMode === 'server'
                        ? `Transmit to #${activeChannel?.name || 'channel'} (**bold**, *italic*, \`code\`)...`
                        : `Message @${activeDmThread?.name || 'friend'}...`
                    }
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setShowGifPicker(!showGifPicker);
                      setShowEmojiPicker(false);
                    }}
                    className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    GIF
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowGifPicker(false);
                    }}
                    className="p-1.5 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:brightness-110 text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </main>

        {/* ======================================================================
            COLLAPSIBLE / SLIDE-OVER RIGHT GLASS INSPECTOR DRAWER
           ====================================================================== */}
        {viewMode === 'server' && activeServer && inspectorDrawerOpen && (
          <aside className="hidden lg:flex w-[280px] shrink-0 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.45)] flex-col overflow-hidden">
            {/* Inspector Tabs */}
            <div className="p-2.5 border-b border-white/10 flex gap-1.5 bg-white/[0.02]">
              <button
                type="button"
                onClick={() => setInspectorTab('members')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  inspectorTab === 'members'
                    ? 'bg-white/15 text-white border border-white/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Members ({visibleServerMembers.length})
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('pinned')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  inspectorTab === 'pinned'
                    ? 'bg-white/15 text-white border border-white/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Pin className="w-3.5 h-3.5 text-amber-400" />
                Pinned ({pinnedMessages.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
              {inspectorTab === 'members' ? (
                <>
                  {activeServer.roles.map((role) => {
                    const roleMembers = visibleServerMembers.filter((m) => {
                      const effRole = getMemberEffectiveRole(m.uid);
                      return effRole?.id === role.id && m.status !== 'invisible';
                    });
                    if (roleMembers.length === 0) return null;

                    return (
                      <div key={role.id}>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1.5 mb-1.5">
                          {role.name} — {roleMembers.length}
                        </h3>
                        <div className="space-y-1">
                          {roleMembers.map((member) => {
                            const st = STATUS_CONFIG[member.status] || STATUS_CONFIG.online;
                            const isTimedOut = (timedOutUsersByServer[activeServer.id] || []).includes(member.uid);

                            return (
                              <button
                                key={member.uid}
                                type="button"
                                onClick={() => setSelectedProfileUser(member)}
                                className="w-full px-2.5 py-2 rounded-2xl bg-white/[0.02] hover:bg-white/[0.08] border border-transparent hover:border-white/10 flex items-center gap-2.5 text-left transition-all cursor-pointer"
                              >
                                <div className="relative shrink-0">
                                  <div
                                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${member.avatarGradient} flex items-center justify-center text-sm`}
                                  >
                                    {member.avatarEmoji}
                                  </div>
                                  <span
                                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0B1021] ${st.color}`}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1">
                                    <span style={{ color: role.color }} className="text-xs font-bold truncate">
                                      {member.displayName}
                                    </span>
                                    {isTimedOut && <Clock className="w-3 h-3 text-amber-400 shrink-0" />}
                                  </div>
                                  {member.customStatus && (
                                    <div className="text-[11px] text-slate-400 truncate">
                                      {member.customStatus}
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Offline Members */}
                  {(() => {
                    const offlineMembers = visibleServerMembers.filter((m) => m.status === 'invisible');
                    if (offlineMembers.length === 0) return null;
                    return (
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1.5 mb-1.5">
                          Offline — {offlineMembers.length}
                        </h3>
                        <div className="space-y-1">
                          {offlineMembers.map((member) => (
                            <button
                              key={member.uid}
                              type="button"
                              onClick={() => setSelectedProfileUser(member)}
                              className="w-full px-2.5 py-1.5 rounded-2xl hover:bg-white/[0.05] flex items-center gap-2.5 text-left opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${member.avatarGradient} flex items-center justify-center text-sm`}>
                                {member.avatarEmoji}
                              </div>
                              <span className="text-xs font-medium text-slate-400 truncate">{member.displayName}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                /* Pinned Messages Tab inside Glass Inspector */
                <div className="space-y-2.5">
                  {pinnedMessages.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No pinned messages in this channel.</p>
                  ) : (
                    pinnedMessages.map((pm) => (
                      <div key={pm.id} className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-cyan-300">{pm.authorName}</span>
                          <button
                            type="button"
                            onClick={() => handleTogglePinMessage(pm)}
                            className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                          >
                            Unpin
                          </button>
                        </div>
                        <div className="text-slate-300">{renderRichMarkdown(pm.content)}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ========================================================================
          4. FLOATING BOTTOM SPATIAL DOCK (VISIONOS / MACOS INSPIRED)
         ======================================================================== */}
      <nav
        aria-label="Spatial Hub Dock"
        className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 rounded-3xl bg-white/[0.07] backdrop-blur-2xl border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.65)] flex items-center gap-2 sm:gap-2.5 z-40"
      >
        {/* Direct Messages Dock Item */}
        <button
          type="button"
          onClick={() => {
            setViewMode('dm');
            setSpatialSubView('chat');
          }}
          title="Direct Messages & Friends"
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 relative cursor-pointer ${
            viewMode === 'dm'
              ? 'bg-gradient-to-br from-cyan-400 to-indigo-600 text-white shadow-lg shadow-cyan-500/35 ring-2 ring-white/40'
              : 'bg-white/[0.07] hover:bg-white/[0.15] text-slate-200 border border-white/10'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {totalUnreadDms > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow">
              {totalUnreadDms}
            </span>
          )}
        </button>

        <div className="w-[1px] h-7 bg-white/15 mx-0.5" />

        {/* Joined Origin Servers */}
        {servers.map((srv) => {
          const isActive = viewMode === 'server' && activeServer?.id === srv.id;
          return (
            <button
              key={srv.id}
              type="button"
              onClick={() => {
                setViewMode('server');
                setActiveServerId(srv.id);
                const firstText = srv.channels.find((c) => c.type !== 'voice') || srv.channels[0];
                if (firstText) setActiveChannelId(firstText.id);
                setSpatialSubView('chat');
              }}
              title={srv.name}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 relative cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-cyan-300/60'
                  : 'bg-white/[0.07] hover:bg-white/[0.15] text-slate-200 border border-white/10'
              }`}
            >
              {srv.icon}
              {isActive && (
                <span className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-cyan-300" />
              )}
            </button>
          );
        })}

        <div className="w-[1px] h-7 bg-white/15 mx-0.5" />

        {/* Quick Voice Room Jump */}
        <button
          type="button"
          onClick={() => {
            if (connectedVoiceChannel) {
              setViewMode('server');
              setSpatialSubView('voice');
            } else if (firstVoiceChannelInServer) {
              setViewMode('server');
              joinVoiceChannel(activeServer, firstVoiceChannelInServer);
            }
          }}
          title={connectedVoiceChannel ? `Return to ${connectedVoiceChannel.channelName}` : 'Quick Join Spatial Voice'}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 cursor-pointer ${
            connectedVoiceChannel
              ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-lg shadow-emerald-500/20'
              : 'bg-white/[0.07] hover:bg-emerald-500/20 text-emerald-300 border border-white/10'
          }`}
        >
          <Volume2 className={`w-5 h-5 ${connectedVoiceChannel ? 'animate-pulse' : ''}`} />
        </button>

        {/* Create / Join Server (+) */}
        <button
          type="button"
          onClick={() => setShowCreateServerModal(true)}
          title="Create or Join an Origin Server"
          className="w-11 h-11 rounded-2xl bg-white/[0.07] hover:bg-indigo-500/30 text-cyan-300 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Discover Public Origins */}
        <button
          type="button"
          onClick={() => setShowDiscoverModal(true)}
          title="Discover Public Origins"
          className="hidden sm:flex w-11 h-11 rounded-2xl bg-white/[0.07] hover:bg-violet-500/30 text-violet-300 hover:text-white border border-white/10 items-center justify-center transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 cursor-pointer"
        >
          <Compass className="w-5 h-5" />
        </button>
      </nav>

      {/* ========================================================================
          MODAL 1: USER PROFILE POPOVER CARD (GLASSMORPHIC)
         ======================================================================== */}
      <nav
        aria-label="Servers Navigation"
        className={`w-[72px] shrink-0 bg-[#080A0F] border-r border-slate-800/80 flex flex-col items-center py-3 gap-2 z-40 transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0 fixed inset-y-0 left-0' : '-translate-x-full fixed inset-y-0 left-0 md:static md:translate-x-0'
        }`}
      >
        {/* Direct Messages Home Button */}
        <div className="relative group flex items-center justify-center w-full">
          <span
            className={`absolute left-0 w-1 rounded-r-full bg-white transition-all duration-200 ${
              viewMode === 'dm' ? 'h-9' : 'h-0 group-hover:h-5'
            }`}
          />
          <button
            type="button"
            onClick={() => {
              setViewMode('dm');
              setMobileMenuOpen(false);
            }}
            title="Direct Messages & Friends"
            className={`w-12 h-12 flex items-center justify-center transition-all duration-200 relative cursor-pointer ${
              viewMode === 'dm'
                ? 'rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'rounded-[24px] hover:rounded-2xl bg-[#181F2E] text-slate-300 hover:bg-indigo-500 hover:text-white'
            }`}
          >
            <MessageSquare className="w-6 h-6" />
            {totalUnreadDms > 0 && (
              <span className="absolute -bottom-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 border-2 border-[#080A0F] text-[11px] font-bold text-white flex items-center justify-center">
                {totalUnreadDms}
              </span>
            )}
          </button>
        </div>

        <div className="w-8 h-[2px] rounded-full bg-slate-800 my-1" />

        {/* Server Icons List */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col items-center gap-2.5 py-1">
          {servers.map((srv) => {
            const isActive = viewMode === 'server' && activeServer?.id === srv.id;
            return (
              <div key={srv.id} className="relative group flex items-center justify-center w-full">
                <span
                  className={`absolute left-0 w-1 rounded-r-full bg-white transition-all duration-200 ${
                    isActive ? 'h-9' : 'h-0 group-hover:h-5'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('server');
                    setActiveServerId(srv.id);
                    const firstText = srv.channels.find((c) => c.type !== 'voice') || srv.channels[0];
                    if (firstText) setActiveChannelId(firstText.id);
                    setMobileMenuOpen(false);
                  }}
                  title={srv.name}
                  className={`w-12 h-12 flex items-center justify-center text-xl font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'rounded-[24px] hover:rounded-2xl bg-[#181F2E] text-slate-200 hover:bg-indigo-500/90 hover:text-white'
                  }`}
                >
                  {srv.icon}
                </button>
              </div>
            );
          })}

          {/* Create / Join Server (+) Button */}
          <button
            type="button"
            onClick={() => setShowCreateServerModal(true)}
            title="Create or Join an Origin Server"
            className="w-12 h-12 rounded-[24px] hover:rounded-2xl bg-[#181F2E] hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* Discover Public Origins Button */}
          <button
            type="button"
            onClick={() => setShowDiscoverModal(true)}
            title="Discover Public Origins"
            className="w-12 h-12 rounded-[24px] hover:rounded-2xl bg-[#181F2E] hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <Compass className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* ========================================================================
          COLUMN 2: SECONDARY SIDEBAR (CHANNELS OR DMs + USER BAR) (240px)
         ======================================================================== */}
      <aside
        className={`w-[248px] shrink-0 bg-[#111622] border-r border-slate-800/80 flex flex-col z-40 transition-transform duration-200 ${
          mobileMenuOpen
            ? 'translate-x-[72px] fixed inset-y-0 left-0'
            : '-translate-x-full fixed inset-y-0 left-0 md:static md:translate-x-0'
        }`}
      >
        {viewMode === 'server' && activeServer ? (
          <>
            {/* Server Header Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setServerDropdownOpen(!serverDropdownOpen)}
                className="w-full h-12 px-4 border-b border-slate-800/90 flex items-center justify-between hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <span className="font-bold text-sm text-white truncate">{activeServer.name}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${serverDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {serverDropdownOpen && (
                <div className="absolute top-13 left-2 right-2 bg-[#0B0E14] border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(activeServer.inviteCode);
                      triggerToast('Invite Code Copied!', `Share code: ${activeServer.inviteCode}`);
                      setServerDropdownOpen(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg text-indigo-400 hover:bg-indigo-500 hover:text-white flex items-center justify-between cursor-pointer"
                  >
                    <span>Invite People ({activeServer.inviteCode})</span>
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                  {canManageChannels && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateChannelModal(true);
                        setServerDropdownOpen(false);
                      }}
                      className="w-full px-2.5 py-2 rounded-lg text-slate-300 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                    >
                      <span>Create Channel</span>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowServerSettingsModal(true);
                      setServerDropdownOpen(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg text-slate-300 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>Server Settings & Roles</span>
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Channel Categories & Channels */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
              {activeServer.categories.map((cat) => {
                const catChannels = activeServer.channels.filter((c) => c.categoryId === cat.id);
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between px-1.5 mb-1 group">
                      <button
                        type="button"
                        onClick={() => {
                          setServers((prev) =>
                            prev.map((s) =>
                              s.id === activeServer.id
                                ? {
                                    ...s,
                                    categories: s.categories.map((c) =>
                                      c.id === cat.id ? { ...c, collapsed: !c.collapsed } : c
                                    )
                                  }
                                : s
                            )
                          );
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-slate-400 hover:text-slate-200 uppercase cursor-pointer"
                      >
                        <ChevronRight
                          className={`w-3 h-3 transition-transform ${cat.collapsed ? '' : 'rotate-90'}`}
                        />
                        <span>{cat.name}</span>
                      </button>
                      {canManageChannels && (
                        <button
                          type="button"
                          onClick={() => setShowCreateChannelModal(true)}
                          title="Add Channel"
                          className="text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {!cat.collapsed && (
                      <div className="space-y-0.5">
                        {catChannels.map((ch) => {
                          const isSelected =
                            ch.type !== 'voice' && activeChannel?.id === ch.id;
                          const isVoiceConnected =
                            ch.type === 'voice' &&
                            connectedVoiceChannel?.channelId === ch.id &&
                            connectedVoiceChannel?.serverId === activeServer.id;

                          return (
                            <div key={ch.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (ch.type === 'voice') {
                                    joinVoiceChannel(activeServer, ch);
                                  } else {
                                    setActiveChannelId(ch.id);
                                  }
                                  setMobileMenuOpen(false);
                                }}
                                className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-500/20 text-white font-medium'
                                    : isVoiceConnected
                                    ? 'bg-emerald-500/15 text-emerald-300 font-medium'
                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                                }`}
                              >
                                {ch.type === 'announcement' ? (
                                  <Megaphone className="w-4 h-4 shrink-0 text-amber-400" />
                                ) : ch.type === 'voice' ? (
                                  <Volume2 className={`w-4 h-4 shrink-0 ${isVoiceConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
                                ) : (
                                  <Hash className="w-4 h-4 shrink-0 text-slate-400" />
                                )}
                                <span className="truncate">{ch.name}</span>
                              </button>

                              {/* Connected Voice Participants Mini-List */}
                              {ch.type === 'voice' && (isVoiceConnected || ch.id === 'ch-lounge') && (
                                <div className="pl-7 pr-2 py-1 space-y-1">
                                  {isVoiceConnected && (
                                    <div className="flex items-center gap-2 text-xs text-slate-200 py-0.5">
                                      <span
                                        className={`w-5 h-5 rounded-full bg-gradient-to-br ${currentUserProfile.avatarGradient} flex items-center justify-center text-[10px] ${
                                          speakingUsers[currentUserProfile.uid] ? 'ring-2 ring-emerald-400' : ''
                                        }`}
                                      >
                                        {currentUserProfile.avatarEmoji}
                                      </span>
                                      <span className="truncate">{currentUserProfile.displayName}</span>
                                      {isMuted && <MicOff className="w-3 h-3 text-rose-400 ml-auto" />}
                                    </div>
                                  )}
                                  {ch.id === 'ch-lounge' && (
                                    <div className="flex items-center gap-2 text-xs text-slate-400 py-0.5">
                                      <span
                                        className={`w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-[10px] ${
                                          speakingUsers['bot-kaelen'] ? 'ring-2 ring-emerald-400' : ''
                                        }`}
                                      >
                                        🛡️
                                      </span>
                                      <span className="truncate">Kaelen Vance</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* DM MODE SECONDARY SIDEBAR */
          <>
            <div className="h-12 px-3 border-b border-slate-800/90 flex items-center">
              <button
                type="button"
                onClick={() => setActiveDmId(null)}
                className="w-full py-1.5 px-2.5 rounded-lg bg-[#0B0E14] border border-slate-800 text-xs text-slate-400 text-left hover:border-slate-700 cursor-pointer"
              >
                Find or start a conversation
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3">
              {/* Friends Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveDmId(null);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-sm font-medium transition-colors cursor-pointer ${
                  activeDmId === null
                    ? 'bg-indigo-500/20 text-white'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Friends
                </span>
                {friendsList.filter((f) => f.status === 'pending_incoming').length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {friendsList.filter((f) => f.status === 'pending_incoming').length}
                  </span>
                )}
              </button>

              <div className="flex items-center justify-between px-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Direct Messages
                </span>
                <button
                  type="button"
                  onClick={() => setShowCreateGroupDmModal(true)}
                  title="Create Group DM"
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                {dmThreads.map((thread) => {
                  const primaryUser = getUserById(thread.participantIds[0]);
                  const isSelected = activeDmId === thread.id;
                  const statusCfg = STATUS_CONFIG[primaryUser.status] || STATUS_CONFIG.online;

                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => {
                        setActiveDmId(thread.id);
                        setDmThreads((prev) =>
                          prev.map((t) => (t.id === thread.id ? { ...t, unread: 0 } : t))
                        );
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full px-2.5 py-2 rounded-lg flex items-center gap-2.5 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-500/20 text-white'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                            thread.isGroup ? 'from-violet-500 to-fuchsia-600' : primaryUser.avatarGradient
                          } flex items-center justify-center text-sm`}
                        >
                          {thread.isGroup ? '👥' : primaryUser.avatarEmoji}
                        </div>
                        {!thread.isGroup && (
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#111622] ${statusCfg.color}`}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{thread.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {thread.isGroup
                            ? `${thread.participantIds.length + 1} Members`
                            : primaryUser.customStatus || statusCfg.label}
                        </div>
                      </div>
                      {thread.unread > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white">
                          {thread.unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Active Voice Connection Mini-Bar */}
        {connectedVoiceChannel && (
          <div className="px-3 py-2 bg-[#0D131F] border-t border-slate-800/90 flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Voice Connected</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {connectedVoiceChannel.channelName}
              </div>
            </div>
            <button
              type="button"
              onClick={disconnectVoiceChannel}
              title="Disconnect Voice"
              className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom User Control Bar */}
        <div className="h-14 px-2.5 bg-[#0B0E14] border-t border-slate-800/90 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => setShowUserSettingsModal(true)}
            className="flex items-center gap-2 min-w-0 flex-1 p-1 rounded-lg hover:bg-slate-800/70 transition-colors text-left cursor-pointer"
          >
            <div className="relative shrink-0">
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${currentUserProfile.avatarGradient} flex items-center justify-center text-sm font-bold text-white overflow-hidden`}
              >
                {currentUserProfile.avatarUrl ? (
                  <img src={currentUserProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  currentUserProfile.avatarEmoji
                )}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0B0E14] ${
                  STATUS_CONFIG[currentUserProfile.status]?.color || 'bg-emerald-500'
                }`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                {currentUserProfile.displayName}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                #{currentUserProfile.tag}
              </div>
            </div>
          </button>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMuted ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsDeafened(!isDeafened)}
              title={isDeafened ? 'Undeafen Audio' : 'Deafen Audio'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDeafened ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Headphones className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowUserSettingsModal(true)}
              title="User Profile & Settings"
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================
          COLUMN 3: MAIN CENTER PANEL (CHAT, VOICE STAGE OR FRIENDS HUB)
         ======================================================================== */}
      <main className="flex-1 min-w-0 bg-[#141926] flex flex-col relative">
        {/* Top Header Bar */}
        <header className="h-12 px-3 sm:px-4 border-b border-slate-800/90 bg-[#141926]/95 backdrop-blur-md flex items-center justify-between gap-2 shrink-0 z-20">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {viewMode === 'server' && activeChannel ? (
              <>
                {activeChannel.type === 'announcement' ? (
                  <Megaphone className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <Hash className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <h2 className="font-bold text-sm sm:text-base text-white truncate">
                  {activeChannel.name}
                </h2>
                {activeChannel.topic && (
                  <span className="hidden lg:inline-block text-xs text-slate-400 border-l border-slate-700 pl-3 truncate max-w-md">
                    {activeChannel.topic}
                  </span>
                )}
              </>
            ) : activeDmThread ? (
              <>
                <AtSign className="w-5 h-5 text-indigo-400 shrink-0" />
                <h2 className="font-bold text-sm sm:text-base text-white truncate">
                  {activeDmThread.name}
                </h2>
              </>
            ) : (
              <>
                <Users className="w-5 h-5 text-indigo-400 shrink-0" />
                <h2 className="font-bold text-sm sm:text-base text-white">Friends</h2>
              </>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {(viewMode === 'server' || activeDmThread) && (
              <>
                {/* Pinned Messages Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPinnedDrawer(!showPinnedDrawer)}
                  title="Pinned Messages"
                  className={`p-1.5 rounded-lg transition-colors relative cursor-pointer ${
                    showPinnedDrawer ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Pin className="w-4 h-4" />
                  {pinnedMessages.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-400" />
                  )}
                </button>

                {/* Search Input */}
                <div className="relative hidden sm:block">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages"
                    className="w-36 focus:w-48 transition-all pl-8 pr-2.5 py-1 rounded-lg bg-[#0B0E14] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            {viewMode === 'server' && (
              <button
                type="button"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setMobileMembersOpen(!mobileMembersOpen);
                  } else {
                    setShowMemberList(!showMemberList);
                  }
                }}
                title="Toggle Member List"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showMemberList ? 'text-white bg-slate-800/80' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Pinned Messages Popover Drawer */}
        {showPinnedDrawer && (
          <div className="absolute top-13 right-4 w-80 sm:w-96 max-h-96 overflow-y-auto bg-[#0B0E14] border border-slate-800 rounded-xl shadow-2xl p-3 z-30">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 text-indigo-400" />
                Pinned Messages ({pinnedMessages.length})
              </span>
              <button
                type="button"
                onClick={() => setShowPinnedDrawer(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {pinnedMessages.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No pinned messages in this channel yet.</p>
            ) : (
              <div className="space-y-2.5">
                {pinnedMessages.map((pm) => (
                  <div key={pm.id} className="p-2.5 rounded-lg bg-[#141926] border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{pm.authorName}</span>
                      <button
                        type="button"
                        onClick={() => handleTogglePinMessage(pm)}
                        className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                      >
                        Unpin
                      </button>
                    </div>
                    <div className="text-slate-300">{renderRichMarkdown(pm.content)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================================
            INTERACTIVE VOICE, VIDEO & SCREEN SHARING STAGE (WHEN CONNECTED)
           ====================================================================== */}
        {connectedVoiceChannel && (
          <section className="bg-[#0B0E14] border-b border-slate-800/90 p-3 sm:p-4 shrink-0">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  {connectedVoiceChannel.channelName}
                </span>
                {pushToTalkMode && (
                  <span className="text-[11px] text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded">
                    PTT: Hold <strong>Spacebar</strong> {isPttPressed ? '(Transmitting)' : ''}
                  </span>
                )}
              </div>
              {mediaNotice && <span className="text-[11px] text-amber-400 hidden sm:inline">{mediaNotice}</span>}
            </div>

            {/* Video / Screen Share Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-56">
              {/* Screen Share Tile (if active) */}
              {isScreenSharing && (
                <div className="sm:col-span-2 rounded-xl bg-[#111622] border-2 border-indigo-500/60 overflow-hidden relative flex flex-col items-center justify-center min-h-[140px]">
                  {screenStream ? (
                    <video ref={screenVideoRef} autoPlay playsInline muted className="w-full h-44 object-contain bg-black" />
                  ) : (
                    <div className="p-4 text-center">
                      <Monitor className="w-8 h-8 text-indigo-400 mx-auto mb-1.5 animate-pulse" />
                      <div className="text-xs font-bold text-white">
                        {currentUserProfile.displayName} is sharing their screen
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        1080p 60fps • Origin Low-Latency WebRTC Stream
                      </div>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-[10px] font-bold text-white uppercase tracking-wider">
                    LIVE SCREEN
                  </span>
                </div>
              )}

              {/* Current User Voice/Video Tile */}
              <div
                className={`rounded-xl bg-[#111622] border transition-all p-3 flex flex-col items-center justify-center relative min-h-[120px] ${
                  speakingUsers[currentUserProfile.uid]
                    ? 'border-emerald-400 shadow-lg shadow-emerald-500/15'
                    : 'border-slate-800'
                }`}
              >
                {isCameraOn && cameraStream ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-32 object-cover rounded-lg" />
                ) : (
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${currentUserProfile.avatarGradient} flex items-center justify-center text-2xl transition-all ${
                      speakingUsers[currentUserProfile.uid] ? 'ring-4 ring-emerald-400 scale-105' : ''
                    }`}
                  >
                    {currentUserProfile.avatarEmoji}
                  </div>
                )}
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-white">
                  <span>{currentUserProfile.displayName}</span>
                  {isMuted && <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                {isCameraOn && !cameraStream && (
                  <span className="text-[10px] text-indigo-400 mt-0.5">Camera Active</span>
                )}
              </div>

              {/* Co-Participant Tile */}
              {!isScreenSharing && (
                <div
                  className={`rounded-xl bg-[#111622] border transition-all p-3 flex flex-col items-center justify-center relative min-h-[120px] ${
                    speakingUsers['bot-kaelen']
                      ? 'border-emerald-400 shadow-lg shadow-emerald-500/15'
                      : 'border-slate-800'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl transition-all ${
                      speakingUsers['bot-kaelen'] ? 'ring-4 ring-emerald-400 scale-105' : ''
                    }`}
                  >
                    🛡️
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white">Kaelen Vance</div>
                  <span className="text-[10px] text-slate-400">Moderator</span>
                </div>
              )}
            </div>

            {/* Stage Media Controls */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isMuted ? 'bg-rose-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </button>

              <button
                type="button"
                onClick={toggleCamera}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isCameraOn ? 'bg-indigo-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isCameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                {isCameraOn ? 'Stop Video' : 'Camera'}
              </button>

              <button
                type="button"
                onClick={toggleScreenShare}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isScreenSharing ? 'bg-indigo-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                {isScreenSharing ? 'Stop Share' : 'Share Screen'}
              </button>

              <button
                type="button"
                onClick={() => setPushToTalkMode(!pushToTalkMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pushToTalkMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                {pushToTalkMode ? 'PTT: ON' : 'Voice Activity'}
              </button>

              <button
                type="button"
                onClick={disconnectVoiceChannel}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          </section>
        )}

        {/* ======================================================================
            FRIENDS DASHBOARD (WHEN IN DM MODE & NO ACTIVE THREAD SELECTED)
           ====================================================================== */}
        {viewMode === 'dm' && !activeDmThread ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Friends Sub-Nav Tabs */}
            <div className="flex flex-wrap items-center gap-2 pb-4 mb-5 border-b border-slate-800">
              {[
                { id: 'online', label: 'Online' },
                { id: 'all', label: 'All Friends' },
                { id: 'pending', label: 'Pending' },
                { id: 'blocked', label: 'Blocked' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFriendsTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    friendsTab === tab.id
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFriendsTab('add')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  friendsTab === 'add'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                Add Friend
              </button>
            </div>

            {friendsTab === 'add' ? (
              <div className="max-w-lg">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
                  Add Friend on Origin
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  You can add friends with their Origin username#tag (try <code className="text-indigo-300">soren#9010</code>).
                </p>
                <form onSubmit={handleSendFriendRequest} className="flex gap-2">
                  <input
                    type="text"
                    value={addFriendInput}
                    onChange={(e) => setAddFriendInput(e.target.value)}
                    placeholder="Enter a username#0000"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0B0E14] border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold cursor-pointer"
                  >
                    Send Request
                  </button>
                </form>
                {friendFeedback && (
                  <p
                    className={`mt-3 text-xs ${
                      friendFeedback.type === 'error'
                        ? 'text-rose-400'
                        : friendFeedback.type === 'success'
                        ? 'text-emerald-400'
                        : 'text-indigo-300'
                    }`}
                  >
                    {friendFeedback.text}
                  </p>
                )}
              </div>
            ) : friendsTab === 'blocked' ? (
              <div className="space-y-2 max-w-2xl">
                {blockedUids.length === 0 ? (
                  <p className="text-xs text-slate-500 py-8 text-center">No blocked users.</p>
                ) : (
                  blockedUids.map((uid) => {
                    const u = getUserById(uid);
                    return (
                      <div
                        key={uid}
                        className="p-3 rounded-xl bg-[#111622] border border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${u.avatarGradient} flex items-center justify-center`}>
                            {u.avatarEmoji}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{u.displayName}</div>
                            <div className="text-xs text-slate-500">Blocked</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBlockedUids((prev) => prev.filter((id) => id !== uid))}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer"
                        >
                          Unblock
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="space-y-2 max-w-2xl">
                {friendsList
                  .filter((f) => {
                    const u = getUserById(f.uid);
                    if (friendsTab === 'online') return f.status === 'accepted' && u.status !== 'invisible';
                    if (friendsTab === 'all') return f.status === 'accepted';
                    if (friendsTab === 'pending') return f.status.startsWith('pending');
                    return true;
                  })
                  .map((f) => {
                    const u = getUserById(f.uid);
                    const st = STATUS_CONFIG[u.status] || STATUS_CONFIG.online;
                    return (
                      <div
                        key={f.uid}
                        className="p-3 rounded-xl bg-[#111622] hover:bg-[#181F2E] border border-slate-800/80 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative">
                            <div
                              className={`w-10 h-10 rounded-full bg-gradient-to-br ${u.avatarGradient} flex items-center justify-center text-lg`}
                            >
                              {u.avatarEmoji}
                            </div>
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#111622] ${st.color}`}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-white truncate">{u.displayName}</span>
                              <span className="text-xs text-slate-500">#{u.tag}</span>
                            </div>
                            <div className="text-xs text-slate-400 truncate">
                              {f.status === 'pending_incoming'
                                ? 'Incoming Friend Request'
                                : f.status === 'pending_outgoing'
                                ? 'Outgoing Friend Request'
                                : u.customStatus || st.label}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {f.status === 'pending_incoming' ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setFriendsList((prev) =>
                                    prev.map((item) => (item.uid === f.uid ? { ...item, status: 'accepted' } : item))
                                  )
                                }
                                title="Accept Request"
                                className="p-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setFriendsList((prev) => prev.filter((item) => item.uid !== f.uid))}
                                title="Decline Request"
                                className="p-2 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : f.status === 'accepted' ? (
                            <button
                              type="button"
                              onClick={() => openOrCreateDirectMessage(u)}
                              title="Send Direct Message"
                              className="p-2 rounded-full bg-slate-800 hover:bg-indigo-500 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setFriendsList((prev) => prev.filter((item) => item.uid !== f.uid))}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        ) : (
          /* ====================================================================
              ACTIVE CHAT FEED & RICH MESSAGE COMPOSER
             ==================================================================== */
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 select-text">
              {/* Channel Welcome Hero */}
              <div className="pt-4 pb-6 border-b border-slate-800/80">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                  {viewMode === 'server' ? <Hash className="w-8 h-8" /> : <AtSign className="w-8 h-8" />}
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome to {viewMode === 'server' ? `#${activeChannel?.name}` : activeDmThread?.name}!
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  {viewMode === 'server'
                    ? activeChannel?.topic || `This is the start of the #${activeChannel?.name} channel.`
                    : `This is the beginning of your direct message history with ${activeDmThread?.name}.`}
                </p>
              </div>

              {/* Message Feed List */}
              {currentFeedMessages.map((msg) => {
                const isOwn = msg.authorId === currentUserProfile.uid;
                const authorObj = getUserById(msg.authorId);

                return (
                  <div
                    key={msg.id}
                    className={`group relative flex items-start gap-3 p-2 -mx-2 rounded-xl transition-colors ${
                      msg.pinned ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Author Avatar */}
                    <button
                      type="button"
                      onClick={() => setSelectedProfileUser(authorObj)}
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                        msg.authorGradient || 'from-indigo-500 to-purple-600'
                      } flex items-center justify-center text-lg shrink-0 mt-0.5 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all`}
                    >
                      {msg.authorAvatarUrl ? (
                        <img src={msg.authorAvatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        msg.authorAvatar || '👤'
                      )}
                    </button>

                    {/* Message Body */}
                    <div className="flex-1 min-w-0">
                      {/* Reply Reference Banner */}
                      {msg.replyTo && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 pl-2 border-l-2 border-indigo-500/60">
                          <Reply className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span className="font-semibold text-slate-300">@{msg.replyTo.authorName}</span>
                          <span className="truncate text-slate-400">{msg.replyTo.content}</span>
                        </div>
                      )}

                      {/* Header Row */}
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setSelectedProfileUser(authorObj)}
                          style={{ color: msg.authorRoleColor || '#FFFFFF' }}
                          className="font-semibold text-sm hover:underline cursor-pointer"
                        >
                          {msg.authorName}
                        </button>
                        <span className="text-[11px] text-slate-500">{formatTimestamp(msg.createdAtMs)}</span>
                        {msg.edited && <span className="text-[10px] text-slate-500">(edited)</span>}
                        {msg.pinned && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 flex items-center gap-1">
                            <Pin className="w-2.5 h-2.5" /> Pinned
                          </span>
                        )}
                      </div>

                      {/* Content or Inline Edit Mode */}
                      {editingMessageId === msg.id ? (
                        <div className="mt-1.5 space-y-2">
                          <input
                            type="text"
                            value={editDraft}
                            onChange={(e) => setEditDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditMessage(msg.id);
                              if (e.key === 'Escape') setEditingMessageId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#0B0E14] border border-indigo-500 text-sm text-white focus:outline-none"
                            autoFocus
                          />
                          <div className="flex items-center gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => handleSaveEditMessage(msg.id)}
                              className="px-2.5 py-1 rounded bg-indigo-500 text-white font-medium cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingMessageId(null)}
                              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-200 mt-0.5">
                          {renderRichMarkdown(msg.content)}
                        </div>
                      )}

                      {/* Image Attachment Preview */}
                      {msg.attachmentUrl && (
                        <div className="mt-2 max-w-sm rounded-xl overflow-hidden border border-slate-800 bg-[#0B0E14]">
                          <img
                            src={msg.attachmentUrl}
                            alt="Attachment"
                            className="w-full max-h-64 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Rich Animated Reaction GIF Card */}
                      {msg.gif && (
                        <div
                          className={`mt-2 max-w-xs rounded-xl bg-gradient-to-br ${msg.gif.bg} p-4 border border-white/15 shadow-lg`}
                        >
                          <div className="text-4xl mb-1">{msg.gif.emoji}</div>
                          <div className="text-xs font-black tracking-wider text-white uppercase">
                            {msg.gif.label}
                          </div>
                        </div>
                      )}

                      {/* Emoji Reactions Pills */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {Object.entries(msg.reactions).map(([emoji, users]) => {
                            const reacted = users.includes(currentUserProfile.uid);
                            return (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => handleToggleReaction(msg, emoji)}
                                className={`px-2 py-0.5 rounded-lg text-xs flex items-center gap-1 border transition-colors cursor-pointer ${
                                  reacted
                                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                                    : 'bg-[#0B0E14] border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span>{emoji}</span>
                                <span className="font-semibold text-[11px]">{users.length}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Hover Floating Action Toolbar */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3 right-2 bg-[#0B0E14] border border-slate-800 rounded-lg shadow-xl flex items-center p-0.5 z-10">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveReactionPickerMsgId(activeReactionPickerMsgId === msg.id ? null : msg.id)
                        }
                        title="Add Reaction"
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded cursor-pointer"
                      >
                        <Smile className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(msg)}
                        title="Reply"
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded cursor-pointer"
                      >
                        <Reply className="w-3.5 h-3.5" />
                      </button>
                      {(canManageMessages || isOwn) && (
                        <button
                          type="button"
                          onClick={() => handleTogglePinMessage(msg)}
                          title={msg.pinned ? 'Unpin Message' : 'Pin Message'}
                          className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded cursor-pointer"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isOwn && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMessageId(msg.id);
                            setEditDraft(msg.content);
                          }}
                          title="Edit Message"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(isOwn || canManageMessages) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg.id)}
                          title="Delete Message"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Quick Reaction Popover */}
                    {activeReactionPickerMsgId === msg.id && (
                      <div className="absolute top-6 right-2 bg-[#0B0E14] border border-slate-700 rounded-xl p-1.5 shadow-2xl flex gap-1 z-20">
                        {QUICK_EMOJIS.slice(0, 6).map((em) => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => handleToggleReaction(msg, em)}
                            className="w-7 h-7 hover:bg-slate-800 rounded-lg flex items-center justify-center text-base cursor-pointer"
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Typing Indicator Bar */}
            <div className="h-5 px-4 text-xs text-slate-400 flex items-center">
              {typingUsers.length > 0 && (
                <span className="flex items-center gap-1.5 animate-pulse text-indigo-300">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <strong>{typingUsers.join(', ')}</strong> is typing...
                </span>
              )}
            </div>

            {/* Composer Area */}
            <div className="px-4 pb-4 pt-1 shrink-0 relative">
              {/* Reply-To Context Bar */}
              {replyingTo && (
                <div className="mb-1.5 px-3 py-1.5 rounded-t-xl bg-[#0B0E14] border border-b-0 border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 truncate">
                    Replying to <strong className="text-indigo-400">{replyingTo.authorName}</strong>:{' '}
                    {replyingTo.content}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Image URL Attachment Input Bar */}
              {showAttachmentInput && (
                <div className="mb-2 p-2 rounded-xl bg-[#0B0E14] border border-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                  <input
                    type="url"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    placeholder="Paste image URL to attach inline preview..."
                    className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachmentInput(false);
                      setAttachmentUrl('');
                    }}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* GIF Picker Popover */}
              {showGifPicker && (
                <div className="absolute bottom-16 right-4 w-72 sm:w-80 bg-[#0B0E14] border border-slate-800 rounded-xl shadow-2xl p-3 z-30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Reaction GIFs
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowGifPicker(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {CURATED_GIFS.map((gif) => (
                      <button
                        key={gif.id}
                        type="button"
                        onClick={() => handleSendMessage(null, gif)}
                        className={`p-3 rounded-lg bg-gradient-to-br ${gif.bg} text-left hover:scale-[1.02] transition-transform cursor-pointer`}
                      >
                        <div className="text-2xl">{gif.emoji}</div>
                        <div className="text-[10px] font-bold text-white mt-1 truncate">{gif.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-4 w-64 bg-[#0B0E14] border border-slate-800 rounded-xl shadow-2xl p-3 z-30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Emojis</span>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {QUICK_EMOJIS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          setMessageInput((prev) => prev + em);
                          setShowEmojiPicker(false);
                        }}
                        className="h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-lg cursor-pointer"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Message Input Box */}
              <form
                onSubmit={(e) => handleSendMessage(e)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0B0E14] border border-slate-800 focus-within:border-indigo-500/80 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setShowAttachmentInput(!showAttachmentInput)}
                  title="Attach Image URL"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={
                    viewMode === 'server'
                      ? `Message #${activeChannel?.name || 'channel'} (supports **bold**, *italic*, \`code\`)`
                      : `Message @${activeDmThread?.name || 'friend'}`
                  }
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => {
                    setShowGifPicker(!showGifPicker);
                    setShowEmojiPicker(false);
                  }}
                  title="Send Reaction GIF"
                  className="px-1.5 py-1 rounded text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  GIF
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowGifPicker(false);
                  }}
                  title="Insert Emoji"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <Smile className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  title="Send Message"
                  className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </main>

      {/* ========================================================================
          COLUMN 4: FAR-RIGHT COLLAPSIBLE MEMBER LIST SIDEBAR (240px)
         ======================================================================== */}
      {viewMode === 'server' && activeServer && (showMemberList || mobileMembersOpen) && (
        <aside
          className={`w-[240px] shrink-0 bg-[#111622] border-l border-slate-800/80 overflow-y-auto p-3 space-y-5 z-40 ${
            mobileMembersOpen
              ? 'fixed inset-y-0 right-0 translate-x-0'
              : 'hidden lg:block'
          }`}
        >
          {activeServer.roles.map((role) => {
            const roleMembers = visibleServerMembers.filter((m) => {
              const effRole = getMemberEffectiveRole(m.uid);
              return effRole?.id === role.id && m.status !== 'invisible';
            });
            if (roleMembers.length === 0) return null;

            return (
              <div key={role.id}>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                  {role.name} — {roleMembers.length}
                </h3>
                <div className="space-y-1">
                  {roleMembers.map((member) => {
                    const st = STATUS_CONFIG[member.status] || STATUS_CONFIG.online;
                    const isTimedOut = (timedOutUsersByServer[activeServer.id] || []).includes(member.uid);

                    return (
                      <button
                        key={member.uid}
                        type="button"
                        onClick={() => {
                          setSelectedProfileUser(member);
                          setMobileMembersOpen(false);
                        }}
                        className="w-full px-2 py-1.5 rounded-lg hover:bg-slate-800/70 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                      >
                        <div className="relative shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${member.avatarGradient} flex items-center justify-center text-sm`}
                          >
                            {member.avatarEmoji}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#111622] ${st.color}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span
                              style={{ color: role.color }}
                              className="text-xs font-semibold truncate"
                            >
                              {member.displayName}
                            </span>
                            {isTimedOut && <Clock className="w-3 h-3 text-amber-400 shrink-0" />}
                          </div>
                          {member.customStatus && (
                            <div className="text-[11px] text-slate-400 truncate">
                              {member.customStatus}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Offline / Invisible Members Group */}
          {(() => {
            const offlineMembers = visibleServerMembers.filter((m) => m.status === 'invisible');
            if (offlineMembers.length === 0) return null;
            return (
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-1.5">
                  Offline — {offlineMembers.length}
                </h3>
                <div className="space-y-1">
                  {offlineMembers.map((member) => (
                    <button
                      key={member.uid}
                      type="button"
                      onClick={() => setSelectedProfileUser(member)}
                      className="w-full px-2 py-1.5 rounded-lg hover:bg-slate-800/60 flex items-center gap-2.5 text-left opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${member.avatarGradient} flex items-center justify-center text-sm`}>
                        {member.avatarEmoji}
                      </div>
                      <span className="text-xs font-medium text-slate-400 truncate">{member.displayName}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </aside>
      )}

      {/* ========================================================================
          MODAL 1: USER PROFILE POPOVER CARD (CLICK ANY USER)
         ======================================================================== */}
      {selectedProfileUser && (
        <div
          onClick={() => setSelectedProfileUser(null)}
          className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-[#111622] border border-slate-800 shadow-2xl overflow-hidden"
          >
            {/* Banner */}
            <div
              style={{ background: selectedProfileUser.banner || BANNER_GRADIENTS[0] }}
              className="h-24 w-full relative"
            >
              <button
                type="button"
                onClick={() => setSelectedProfileUser(null)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 pb-5 relative">
              {/* Avatar overlapping banner */}
              <div className="-mt-10 mb-3 flex items-end justify-between">
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-full border-4 border-[#111622] bg-gradient-to-br ${selectedProfileUser.avatarGradient} flex items-center justify-center text-3xl shadow-lg`}
                  >
                    {selectedProfileUser.avatarEmoji}
                  </div>
                  <span
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#111622] ${
                      STATUS_CONFIG[selectedProfileUser.status]?.color || 'bg-emerald-500'
                    }`}
                  />
                </div>

                {selectedProfileUser.uid !== currentUserProfile.uid && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openOrCreateDirectMessage(selectedProfileUser)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </button>
                    {!friendsList.some((f) => f.uid === selectedProfileUser.uid) && (
                      <button
                        type="button"
                        onClick={() => {
                          setFriendsList((prev) => [...prev, { uid: selectedProfileUser.uid, status: 'pending_outgoing' }]);
                          triggerToast('Friend Request Sent', `Sent to ${selectedProfileUser.displayName}`);
                        }}
                        title="Add Friend"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  {selectedProfileUser.displayName}
                  <span className="text-xs font-normal text-slate-400">
                    @{selectedProfileUser.username}#{selectedProfileUser.tag}
                  </span>
                </h3>
                {selectedProfileUser.customStatus && (
                  <p className="text-xs text-indigo-300 mt-0.5">{selectedProfileUser.customStatus}</p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#0B0E14] border border-slate-800/80 space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                    About Me
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedProfileUser.bio || 'No bio set yet.'}
                  </p>
                </div>

                {viewMode === 'server' && activeServer && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Server Role
                    </span>
                    {(() => {
                      const r = getMemberEffectiveRole(selectedProfileUser.uid);
                      return r ? (
                        <span
                          style={{ borderColor: r.color, color: r.color }}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border bg-slate-900/80 text-[11px] font-semibold"
                        >
                          <span style={{ backgroundColor: r.color }} className="w-2 h-2 rounded-full" />
                          {r.name}
                        </span>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Moderation Controls (if viewer has permission & target is not self) */}
              {selectedProfileUser.uid !== currentUserProfile.uid && (
                <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-1.5">
                  {canKickBan && viewMode === 'server' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleModAction('timeout', selectedProfileUser)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Clock className="w-3 h-3" /> Timeout
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModAction('kick', selectedProfileUser)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <UserMinus className="w-3 h-3" /> Kick
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModAction('ban', selectedProfileUser)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Ban className="w-3 h-3" /> Ban
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setBlockedUids((prev) =>
                        prev.includes(selectedProfileUser.uid)
                          ? prev.filter((id) => id !== selectedProfileUser.uid)
                          : [...prev, selectedProfileUser.uid]
                      );
                      setSelectedProfileUser(null);
                      triggerToast('Updated Block List');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium ml-auto cursor-pointer"
                  >
                    {blockedUids.includes(selectedProfileUser.uid) ? 'Unblock User' : 'Block User'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL 2: USER PROFILE & PRESENCE SETTINGS MODAL
         ======================================================================== */}
      {showUserSettingsModal && (
        <div
          onClick={() => setShowUserSettingsModal(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111622] border border-slate-800 shadow-2xl p-6"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                User Profile & Presence Settings
              </h2>
              <button
                type="button"
                onClick={() => setShowUserSettingsModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Presence Status Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Online Presence Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCurrentUserProfile((prev) => ({ ...prev, status: key }))}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        currentUserProfile.status === key
                          ? 'bg-indigo-500/20 border-indigo-500 text-white'
                          : 'bg-[#0B0E14] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${cfg.color}`} />
                      <span className="truncate">{cfg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={currentUserProfile.displayName}
                    onChange={(e) =>
                      setCurrentUserProfile((prev) => ({ ...prev, displayName: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0E14] border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Username & Tag
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={currentUserProfile.username}
                      onChange={(e) =>
                        setCurrentUserProfile((prev) => ({
                          ...prev,
                          username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                        }))
                      }
                      className="flex-1 px-3 py-2 rounded-lg bg-[#0B0E14] border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      maxLength={4}
                      value={currentUserProfile.tag}
                      onChange={(e) =>
                        setCurrentUserProfile((prev) => ({
                          ...prev,
                          tag: e.target.value.replace(/[^0-9]/g, '')
                        }))
                      }
                      className="w-16 px-2 py-2 rounded-lg bg-[#0B0E14] border border-slate-800 text-sm text-center text-slate-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Custom Status Text
                </label>
                <input
                  type="text"
                  value={currentUserProfile.customStatus}
                  onChange={(e) =>
                    setCurrentUserProfile((prev) => ({ ...prev, customStatus: e.target.value }))
                  }
                  placeholder="What are you up to?"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0E14] border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  About Me / Bio
                </label>
                <textarea
                  rows={2}
                  value={currentUserProfile.bio}
                  onChange={(e) =>
                    setCurrentUserProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0E14] border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Avatar Emoji, Image URL & Gradient Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Avatar Emoji
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['🚀', '⚡', '🦊', '👾', '🎧', '🌌', '💎', '🔥'].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() =>
                          setCurrentUserProfile((prev) => ({ ...prev, avatarEmoji: em, avatarUrl: '' }))
                        }
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center text-base cursor-pointer ${
                          currentUserProfile.avatarEmoji === em
                            ? 'bg-indigo-500/20 border-indigo-500'
                            : 'bg-[#0B0E14] border-slate-800'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Avatar Accent Gradient
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_GRADIENTS.map((grad) => (
                      <button
                        key={grad}
                        type="button"
                        onClick={() =>
                          setCurrentUserProfile((prev) => ({ ...prev, avatarGradient: grad }))
                        }
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${grad} ${
                          currentUserProfile.avatarGradient === grad ? 'ring-2 ring-white scale-110' : ''
                        } cursor-pointer`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Profile Banner Theme
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {BANNER_GRADIENTS.map((bg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentUserProfile((prev) => ({ ...prev, banner: bg }))}
                      style={{ background: bg }}
                      className={`h-8 rounded-lg border ${
                        currentUserProfile.banner === bg ? 'border-white ring-2 ring-indigo-400' : 'border-slate-700'
                      } cursor-pointer`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (firebaseUser) {
                    try {
                      await setDoc(
                        doc(db, 'artifacts', appId, 'users', firebaseUser.uid, 'profile', 'main'),
                        currentUserProfile
                      );
                    } catch (_) {}
                  }
                  setShowUserSettingsModal(false);
                  triggerToast('Profile Updated', 'Your Origin profile & presence are live.');
                }}
                className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL 3: CREATE OR JOIN SERVER MODAL
         ======================================================================== */}
      {showCreateServerModal && (
        <CreateOrJoinServerModal
          onClose={() => setShowCreateServerModal(false)}
          onCreateServer={(name, icon, description) => {
            const newSrv = {
              id: `srv-${Date.now()}`,
              name,
              icon: icon || '🌐',
              inviteCode: `ORG-${Math.floor(1000 + Math.random() * 9000)}`,
              description: description || 'A brand new Origin community.',
              ownerId: currentUserProfile.uid,
              roles: [
                { id: 'role-founder', name: 'Owner', color: '#818CF8', permissions: { manageServer: true, manageChannels: true, kickBan: true, sendMessages: true, manageMessages: true } },
                { id: 'role-member', name: 'Members', color: '#94A3B8', permissions: { manageServer: false, manageChannels: false, kickBan: false, sendMessages: true, manageMessages: false } }
              ],
              categories: [
                { id: `cat-t-${Date.now()}`, name: 'TEXT CHANNELS', collapsed: false },
                { id: `cat-v-${Date.now()}`, name: 'VOICE CHANNELS', collapsed: false }
              ],
              channels: []
            };
            const textCh = {
              id: `ch-gen-${Date.now()}`,
              categoryId: newSrv.categories[0].id,
              name: 'general',
              type: 'text',
              topic: `Welcome to ${name}!`
            };
            const voiceCh = {
              id: `ch-vc-${Date.now()}`,
              categoryId: newSrv.categories[1].id,
              name: 'General Voice',
              type: 'voice',
              topic: 'Drop-in voice chat'
            };
            newSrv.channels = [textCh, voiceCh];
            setServers((prev) => [...prev, newSrv]);
            setViewMode('server');
            setActiveServerId(newSrv.id);
            setActiveChannelId(textCh.id);
            setShowCreateServerModal(false);
            triggerToast(`Created "${name}"`, `Invite Code: ${newSrv.inviteCode}`);
          }}
          onJoinByCode={(code) => {
            const found = servers.find((s) => s.inviteCode.toLowerCase() === code.trim().toLowerCase());
            if (found) {
              setViewMode('server');
              setActiveServerId(found.id);
              setActiveChannelId(found.channels[0]?.id);
              setShowCreateServerModal(false);
              triggerToast(`Joined ${found.name}`);
            } else {
              triggerToast('Invalid Invite Code', 'Try ORIGIN-HQ or SYNTH-99', 'error');
            }
          }}
        />
      )}

      {/* ========================================================================
          MODAL 4: CREATE CHANNEL MODAL
         ======================================================================== */}
      {showCreateChannelModal && activeServer && (
        <CreateChannelModal
          categories={activeServer.categories}
          onClose={() => setShowCreateChannelModal(false)}
          onCreate={(name, type, categoryId, topic) => {
            const cleanName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '') || 'new-channel';
            const newCh = {
              id: `ch-${Date.now()}`,
              categoryId,
              name: cleanName,
              type,
              topic
            };
            setServers((prev) =>
              prev.map((s) =>
                s.id === activeServer.id ? { ...s, channels: [...s.channels, newCh] } : s
              )
            );
            if (type !== 'voice') setActiveChannelId(newCh.id);
            setShowCreateChannelModal(false);
            triggerToast(`Created #${cleanName}`);
          }}
        />
      )}

      {/* ========================================================================
          MODAL 5: SERVER SETTINGS, ROLES & MODERATION MODAL
         ======================================================================== */}
      {showServerSettingsModal && activeServer && (
        <ServerSettingsModal
          server={activeServer}
          activeTab={serverSettingsTab}
          setActiveTab={setServerSettingsTab}
          members={visibleServerMembers}
          bannedUids={bannedUsersByServer[activeServer.id] || []}
          getMemberEffectiveRole={getMemberEffectiveRole}
          onAssignRole={(uid, roleId) => {
            setMemberRoleOverrides((prev) => ({
              ...prev,
              [`${activeServer.id}:${uid}`]: roleId
            }));
            triggerToast('Member Role Updated');
          }}
          onUnban={(uid) => {
            setBannedUsersByServer((prev) => ({
              ...prev,
              [activeServer.id]: (prev[activeServer.id] || []).filter((id) => id !== uid)
            }));
            triggerToast('User Unbanned');
          }}
          onUpdateServer={(updates) => {
            setServers((prev) =>
              prev.map((s) => (s.id === activeServer.id ? { ...s, ...updates } : s))
            );
            triggerToast('Server Settings Saved');
          }}
          onAddRole={(roleObj) => {
            setServers((prev) =>
              prev.map((s) =>
                s.id === activeServer.id ? { ...s, roles: [...s.roles, roleObj] } : s
              )
            );
            triggerToast(`Role "${roleObj.name}" Created`);
          }}
          onDeleteServer={() => {
            if (servers.length <= 1) {
              triggerToast('Cannot Delete Last Server', 'Create another server first.', 'error');
              return;
            }
            const remaining = servers.filter((s) => s.id !== activeServer.id);
            setServers(remaining);
            setActiveServerId(remaining[0].id);
            setActiveChannelId(remaining[0].channels[0]?.id);
            setShowServerSettingsModal(false);
            triggerToast('Server Deleted');
          }}
          onClose={() => setShowServerSettingsModal(false)}
        />
      )}

      {/* ========================================================================
          MODAL 6: DISCOVER PUBLIC ORIGINS MODAL
         ======================================================================== */}
      {showDiscoverModal && (
        <div
          onClick={() => setShowDiscoverModal(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl bg-[#111622] border border-slate-800 shadow-2xl p-6"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Discover Public Origins</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowDiscoverModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'pub-ai',
                  name: 'AI & Neural Forge',
                  icon: '🧠',
                  members: '14,280 Online',
                  desc: 'Prompt engineering, open-source LLMs, and real-time multi-agent demos.'
                },
                {
                  id: 'pub-gamedev',
                  name: 'Indie Game Foundry',
                  icon: '🎮',
                  members: '8,910 Online',
                  desc: 'Shaders, WebGL engines, pixel art critiques, and weekend game jams.'
                }
              ].map((pub) => (
                <div
                  key={pub.id}
                  className="p-4 rounded-xl bg-[#0B0E14] border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl">
                        {pub.icon}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm text-white">{pub.name}</h3>
                        <span className="text-[11px] text-emerald-400">{pub.members}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">{pub.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const exists = servers.find((s) => s.id === pub.id);
                      if (!exists) {
                        const newPubSrv = {
                          id: pub.id,
                          name: pub.name,
                          icon: pub.icon,
                          inviteCode: pub.id.toUpperCase(),
                          description: pub.desc,
                          ownerId: 'bot-nova',
                          roles: DEFAULT_SERVERS_SEED[0].roles,
                          categories: [{ id: `cat-${pub.id}`, name: 'PUBLIC LOBBY', collapsed: false }],
                          channels: [
                            { id: `ch-${pub.id}-1`, categoryId: `cat-${pub.id}`, name: 'welcome-lobby', type: 'text', topic: pub.desc },
                            { id: `ch-${pub.id}-2`, categoryId: `cat-${pub.id}`, name: 'Live Stage', type: 'voice', topic: 'Community Voice' }
                          ]
                        };
                        setServers((prev) => [...prev, newPubSrv]);
                        setActiveChannelId(newPubSrv.channels[0].id);
                      } else {
                        setActiveChannelId(exists.channels[0].id);
                      }
                      setViewMode('server');
                      setActiveServerId(pub.id);
                      setShowDiscoverModal(false);
                      triggerToast(`Joined ${pub.name}!`);
                    }}
                    className="w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold cursor-pointer"
                  >
                    Join Community
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL 7: CREATE GROUP DM MODAL
         ======================================================================== */}
      {showCreateGroupDmModal && (
        <CreateGroupDmModal
          friends={COMMUNITY_MEMBERS_SEED}
          onClose={() => setShowCreateGroupDmModal(false)}
          onCreate={(groupName, selectedIds) => {
            const newGroup = {
              id: `dm-grp-${Date.now()}`,
              isGroup: true,
              name: groupName || 'Squad Chat',
              participantIds: selectedIds,
              unread: 0
            };
            setDmThreads((prev) => [newGroup, ...prev]);
            setActiveDmId(newGroup.id);
            setShowCreateGroupDmModal(false);
            triggerToast('Group DM Created');
          }}
        />
      )}

      {/* ========================================================================
          FLOATING TOAST NOTIFICATION
         ======================================================================== */}
      {toastNotification && (
        <div className="fixed bottom-5 right-5 max-w-xs bg-[#0B0E14] border border-indigo-500/50 rounded-xl shadow-2xl px-4 py-3 z-50 flex items-start gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-white">{toastNotification.title}</div>
            {toastNotification.description && (
              <div className="text-[11px] text-slate-400 mt-0.5">{toastNotification.description}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: CREATE OR JOIN SERVER MODAL
// ============================================================================
function CreateOrJoinServerModal({ onClose, onCreateServer, onJoinByCode }) {
  const [tab, setTab] = useState('create');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🚀');
  const [desc, setDesc] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-[#111622] border border-slate-800 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            {tab === 'create' ? 'Create Your Origin' : 'Join an Origin Server'}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-5 p-1 rounded-xl bg-[#0B0E14] border border-slate-800">
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              tab === 'create' ? 'bg-indigo-500 text-white' : 'text-slate-400'
            }`}
          >
            Create New
          </button>
          <button
            type="button"
            onClick={() => setTab('join')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              tab === 'join' ? 'bg-indigo-500 text-white' : 'text-slate-400'
            }`}
          >
            Join with Invite
          </button>
        </div>

        {tab === 'create' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) onCreateServer(name.trim(), icon, desc.trim());
            }}
            className="space-y-3.5"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Server Icon
              </label>
              <div className="flex gap-2">
                {['🚀', '⚡', '🌌', '🎮', '💻', '🎨', '🔥', '🛡️'].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setIcon(em)}
                    className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center cursor-pointer ${
                      icon === em ? 'bg-indigo-500/20 border-indigo-500' : 'bg-[#0B0E14] border-slate-800'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Server Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Midnight Builders"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E14] border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What is this community about?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E14] border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold cursor-pointer"
            >
              Create Server
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inviteCode.trim()) onJoinByCode(inviteCode);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Invite Code
              </label>
              <input
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="e.g. ORIGIN-HQ or SYNTH-99"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E14] border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold cursor-pointer"
            >
              Join Server
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: CREATE CHANNEL MODAL
// ============================================================================
function CreateChannelModal({ categories, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [topic, setTopic] = useState('');

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-[#111622] border border-slate-800 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Create Channel</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) onCreate(name, type, categoryId, topic);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Channel Type
            </label>
            <div className="space-y-2">
              {[
                { id: 'text', label: 'Text Channel', desc: 'Send messages, code blocks, images & GIFs', icon: Hash },
                { id: 'announcement', label: 'Announcement Channel', desc: 'Read-only updates for members', icon: Megaphone },
                { id: 'voice', label: 'Voice & Stage Channel', desc: 'Drop-in audio, video & screen sharing', icon: Volume2 }
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
                      type === item.id
                        ? 'bg-indigo-500/20 border-indigo-500 text-white'
                        : 'bg-[#0B0E14] border-slate-800 text-slate-300'
                    }`}
                  >
                    <IconComp className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0E14] border border-slate-800 text-xs text-white focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Channel Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. design-feedback"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0B0E14] border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold cursor-pointer"
          >
            Create Channel
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: SERVER SETTINGS, ROLES & MODERATION MODAL
// ============================================================================
function ServerSettingsModal({
  server,
  activeTab,
  setActiveTab,
  members,
  bannedUids,
  getMemberEffectiveRole,
  onAssignRole,
  onUnban,
  onUpdateServer,
  onAddRole,
  onDeleteServer,
  onClose
}) {
  const [srvName, setSrvName] = useState(server.name);
  const [srvIcon, setSrvIcon] = useState(server.icon);
  const [srvDesc, setSrvDesc] = useState(server.description || '');

  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#A855F7');
  const [newRolePerms, setNewRolePerms] = useState({
    manageServer: false,
    manageChannels: true,
    kickBan: false,
    sendMessages: true,
    manageMessages: true
  });

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[88vh] overflow-hidden rounded-2xl bg-[#111622] border border-slate-800 shadow-2xl flex flex-col sm:flex-row"
      >
        {/* Left Settings Nav */}
        <div className="w-full sm:w-48 bg-[#0B0E14] border-b sm:border-b-0 sm:border-r border-slate-800 p-3 flex sm:flex-col gap-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'roles', label: 'Roles & Permissions' },
            { id: 'members', label: 'Members & Bans' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                activeTab === t.id ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            type="button"
            onClick={onDeleteServer}
            className="sm:mt-auto px-3 py-2 rounded-lg text-xs font-semibold text-left text-rose-400 hover:bg-rose-500/15 cursor-pointer"
          >
            Delete Server
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white uppercase tracking-wide">{activeTab}</h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Server Icon</label>
                  <input
                    type="text"
                    value={srvIcon}
                    onChange={(e) => setSrvIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0E14] border border-slate-800 text-center text-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1">Server Name</label>
                  <input
                    type="text"
                    value={srvName}
                    onChange={(e) => setSrvName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0E14] border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={srvDesc}
                  onChange={(e) => setSrvDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0E14] border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0B0E14] border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-300">Permanent Server Invite Code</div>
                  <div className="text-sm font-mono text-indigo-400">{server.inviteCode}</div>
                </div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(server.inviteCode)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>

              <button
                type="button"
                onClick={() => onUpdateServer({ name: srvName, icon: srvIcon, description: srvDesc })}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold cursor-pointer"
              >
                Save Server Overview
              </button>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-5">
              {/* Existing Roles List */}
              <div className="space-y-2">
                {server.roles.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-[#0B0E14] border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ backgroundColor: r.color }} className="w-3.5 h-3.5 rounded-full" />
                      <span style={{ color: r.color }} className="text-sm font-bold">
                        {r.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(r.permissions)
                        .filter(([, val]) => val)
                        .map(([permKey]) => (
                          <span key={permKey} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                            {permKey}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Create Custom Role Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newRoleName.trim()) return;
                  onAddRole({
                    id: `role-${Date.now()}`,
                    name: newRoleName.trim(),
                    color: newRoleColor,
                    permissions: newRolePerms
                  });
                  setNewRoleName('');
                }}
                className="p-4 rounded-xl bg-[#0B0E14] border border-slate-800 space-y-3"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Create Custom Role
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Role Name (e.g. VIP Creator)"
                    className="flex-1 px-3 py-2 rounded-lg bg-[#111622] border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="color"
                    value={newRoleColor}
                    onChange={(e) => setNewRoleColor(e.target.value)}
                    className="w-10 h-9 rounded bg-transparent cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  {Object.keys(newRolePerms).map((perm) => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRolePerms[perm]}
                        onChange={(e) =>
                          setNewRolePerms((prev) => ({ ...prev, [perm]: e.target.checked }))
                        }
                      />
                      <span>{perm}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold cursor-pointer"
                >
                  Add Role
                </button>
              </form>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-3">
              {members.map((m) => {
                const effRole = getMemberEffectiveRole(m.uid);
                return (
                  <div
                    key={m.uid}
                    className="p-3 rounded-xl bg-[#0B0E14] border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{m.avatarEmoji}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{m.displayName}</div>
                        <div className="text-[11px] text-slate-500">@{m.username}#{m.tag}</div>
                      </div>
                    </div>

                    <select
                      value={effRole?.id || ''}
                      onChange={(e) => onAssignRole(m.uid, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#111622] border border-slate-700 text-xs text-slate-200"
                    >
                      {server.roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}

              {bannedUids.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-rose-400 mb-2">Banned Users ({bannedUids.length})</h4>
                  {bannedUids.map((uid) => (
                    <div key={uid} className="flex items-center justify-between text-xs p-2 bg-rose-500/10 rounded-lg">
                      <span>{uid}</span>
                      <button
                        type="button"
                        onClick={() => onUnban(uid)}
                        className="text-indigo-300 underline cursor-pointer"
                      >
                        Revoke Ban
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: CREATE GROUP DM MODAL
// ============================================================================
function CreateGroupDmModal({ friends, onClose, onCreate }) {
  const [groupName, setGroupName] = useState('');
  const [selectedIds, setSelectedIds] = useState(['bot-nova', 'bot-lyra']);

  const toggleId = (uid) => {
    setSelectedIds((prev) => (prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]));
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-[#111622] border border-slate-800 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Create Group DM</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedIds.length > 0) onCreate(groupName.trim(), selectedIds);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Weekend Hackathon Squad"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0B0E14] border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {friends.map((f) => (
              <label
                key={f.uid}
                className="flex items-center justify-between p-2 rounded-lg bg-[#0B0E14] border border-slate-800 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-xs text-white">
                  <span>{f.avatarEmoji}</span>
                  <span>{f.displayName}</span>
                </span>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(f.uid)}
                  onChange={() => toggleId(f.uid)}
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold cursor-pointer"
          >
            Create Group Chat
          </button>
        </form>
      </div>
    </div>
  );
}

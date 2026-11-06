import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Text, View, Pressable, TextInput, ScrollView } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { isSupabaseConfigured, supabase } from './src/lib/supabase';

type Tab = 'Chats' | 'Stories' | 'Communities' | 'Wallet' | 'Profile';

const colors = {
  bg: '#09090F',
  panel: '#13131D',
  panel2: '#1A1A28',
  purple: '#8B5CF6',
  text: '#F5F3FF',
  muted: '#A1A1B5',
  border: '#29293A',
  green: '#4ADE80',
};

const demoChats = [
  { name: 'Welcome to VYROX', message: 'Your private messaging space starts here.', time: 'Now', initials: 'V' },
  { name: 'Project Team', message: 'Group conversations will appear here.', time: '—', initials: 'PT' },
  { name: 'Saved Messages', message: 'A place for notes and links.', time: '—', initials: 'S' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('Chats');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function signInOrSignUp(mode: 'signin' | 'signup') {
    if (!supabase) {
      setNotice('Add your Supabase URL and publishable key to .env, then restart Expo.');
      return;
    }
    if (!email.trim() || password.length < 8) {
      setNotice('Enter an email and a password with at least 8 characters.');
      return;
    }
    setBusy(true);
    setNotice('');
    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email: email.trim(), password })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    setNotice(result.error ? result.error.message : (mode === 'signup' ? 'Account request sent. Check your email if confirmation is enabled.' : 'Signed in. Session is ready.'));
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900', letterSpacing: 2 }}>VYROX</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Your space. Your conversations.</Text>
        </View>
        <View style={{ backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.border, borderRadius: 22, paddingHorizontal: 12, paddingVertical: 8 }}>
          <Text style={{ color: colors.green, fontSize: 11, fontWeight: '700' }}>FOUNDATION BUILD</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}>
        <View style={{ backgroundColor: colors.panel, borderColor: colors.border, borderWidth: 1, borderRadius: 22, padding: 18, marginBottom: 18 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: 6 }}>Welcome to VYROX</Text>
          <Text style={{ color: colors.muted, lineHeight: 20, marginBottom: 14 }}>A new messaging app built around privacy, community and creator rewards.</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 6 }}>SUPABASE CONNECTION</Text>
          <Text style={{ color: isSupabaseConfigured ? colors.green : '#FBBF24', fontWeight: '700' }}>
            {isSupabaseConfigured ? 'Configuration detected' : 'Not connected yet — add .env settings'}
          </Text>
        </View>

        <View style={{ backgroundColor: colors.panel, borderColor: colors.border, borderWidth: 1, borderRadius: 22, padding: 16, marginBottom: 18 }}>
          <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 12 }}>Account setup</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="email-address" style={{ color: colors.text, backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 13, marginBottom: 10 }} />
          <TextInput value={password} onChangeText={setPassword} placeholder="Password (8+ characters)" placeholderTextColor={colors.muted} secureTextEntry style={{ color: colors.text, backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 13, marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable disabled={busy} onPress={() => signInOrSignUp('signup')} style={{ flex: 1, backgroundColor: colors.purple, padding: 13, borderRadius: 12, alignItems: 'center', opacity: busy ? 0.6 : 1 }}>
              <Text style={{ color: 'white', fontWeight: '800' }}>{busy ? 'Please wait…' : 'Create account'}</Text>
            </Pressable>
            <Pressable disabled={busy} onPress={() => signInOrSignUp('signin')} style={{ flex: 1, backgroundColor: colors.panel2, borderColor: colors.border, borderWidth: 1, padding: 13, borderRadius: 12, alignItems: 'center', opacity: busy ? 0.6 : 1 }}>
              <Text style={{ color: colors.text, fontWeight: '800' }}>Sign in</Text>
            </Pressable>
          </View>
          {!!notice && <Text style={{ color: colors.muted, marginTop: 12, lineHeight: 19 }}>{notice}</Text>}
        </View>

        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 10 }}>Your conversations</Text>
        {demoChats.map((chat) => (
          <Pressable key={chat.name} onPress={() => setNotice('Chat screens and real-time messaging are the next implementation stage.')} style={{ flexDirection: 'row', alignItems: 'center', padding: 13, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 16, marginBottom: 9 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ color: colors.purple, fontWeight: '900' }}>{chat.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '800', marginBottom: 4 }}>{chat.name}</Text>
              <Text numberOfLines={1} style={{ color: colors.muted, fontSize: 12 }}>{chat.message}</Text>
            </View>
            <Text style={{ color: colors.muted, fontSize: 11 }}>{chat.time}</Text>
          </Pressable>
        ))}

        <View style={{ marginTop: 10, backgroundColor: colors.panel, borderRadius: 18, borderColor: colors.border, borderWidth: 1, padding: 14 }}>
          <Text style={{ color: colors.text, fontWeight: '800', marginBottom: 6 }}>Build roadmap</Text>
          <Text style={{ color: colors.muted, lineHeight: 21 }}>1. Authentication and profiles{"\n"}2. Real-time one-to-one and group chats{"\n"}3. Stories, media and notifications{"\n"}4. Communities and privacy{"\n"}5. Secure rewards wallet and admin dashboard</Text>
        </View>
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, paddingHorizontal: 5, borderTopColor: colors.border, borderTopWidth: 1, backgroundColor: colors.bg }}>
        {(['Chats', 'Stories', 'Communities', 'Wallet', 'Profile'] as Tab[]).map((item) => (
          <Pressable key={item} onPress={() => { setTab(item); if (item !== 'Chats') setNotice(`${item} is planned for the next build stage.`); }} style={{ alignItems: 'center', paddingHorizontal: 5 }}>
            <Text style={{ color: tab === item ? colors.purple : colors.muted, fontWeight: tab === item ? '800' : '500', fontSize: 11 }}>{item}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

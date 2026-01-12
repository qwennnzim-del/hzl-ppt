
import React from 'react';
import { SlideData } from './types';
import { Zap, Target, BarChart3, Users, Cpu, Layers, MessageSquare, ArrowRight, Heart, Shield, Star, Smile, Cloud, Sparkles, Flower2, Music, Hash, Globe } from 'lucide-react';

// Palette: Lime, Cyan, Rose, Yellow, Violet, Orange
export const SLIDES: SlideData[] = [
  // 1. COVER / PEMBUKAAN
  {
    id: 1,
    title: "SOPAN & ETIKA",
    subtitle: "SELAMAT DATANG • MULAI...",
    content: "Panduan sederhana untuk menjadi pribadi berkualitas di era modern. Tetap santai, tapi penuh tata krama.",
    type: 'hero',
    accentColor: '#bef264', // Lime-400
    tags: ["SIKAP DASAR", "PANDUAN ETIKA", "LEVEL UP"]
  },
  
  // 2. MATERI 1: FONDASI (SPLIT)
  {
    id: 2,
    title: "Fondasi Dasar",
    subtitle: "01 / MENGAPA PENTING?",
    content: "Sopan santun bukan sekadar formalitas, tapi mata uang sosial yang berlaku di mana saja. Skill tinggi tanpa etika tidak akan membawamu jauh. Orang akan mengingat bagaimana kamu memperlakukan mereka, bukan seberapa pintar dirimu.",
    type: 'split',
    accentColor: '#22d3ee', // Cyan-400
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000&auto=format&fit=crop"
  },

  // 3. MATERI 2: DIGITAL (IMAGE FOCUS)
  {
    id: 3,
    title: "Jejak Digital",
    subtitle: "02 / DUNIA MAYA",
    content: "Internet tidak pernah lupa. Apa yang kamu ketik mencerminkan karakter aslimu. Hindari berdebat kosong, hargai karya orang lain, dan jangan mengetik sesuatu yang tidak akan kamu ucapkan secara langsung di depan wajah seseorang.",
    type: 'image',
    accentColor: '#facc15', // Yellow-400
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop"
  },

  // 4. MATERI 3: INTERAKSI (SPLIT)
  {
    id: 4,
    title: "Interaksi Nyata",
    subtitle: "03 / TATAP MUKA",
    content: "Dalam pertemuan langsung, bahasa tubuh berbicara lebih keras dari kata-kata. Tatap mata lawan bicara, berikan senyum tulus, dan simpan ponselmu. Menghargai kehadiran fisik seseorang adalah bentuk penghormatan tertinggi saat ini.",
    type: 'split',
    accentColor: '#f43f5e', // Rose-500
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop"
  },

  // 5. MATERI 4: RUANG PUBLIK (SPLIT)
  {
    id: 5,
    title: "Ruang Publik",
    subtitle: "04 / ETIKA UMUM",
    content: "Dunia bukan milikmu sendiri. Jaga volume suara, antre dengan sabar, dan jangan tinggalkan sampah sembarangan. Kesadaran diri di tempat umum menunjukkan kelas yang sebenarnya.",
    type: 'split',
    accentColor: '#c084fc', // Violet-400
    imageUrl: "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=2000&auto=format&fit=crop"
  },

  // 6. MATERI 5: KOMUNIKASI (SPLIT - NEW)
  {
    id: 6,
    title: "Komunikasi",
    subtitle: "05 / SENI BICARA",
    content: "Nada suara menentukan pesan yang diterima. Mendengarkan adalah bagian terpenting dari komunikasi, bukan sekadar menunggu giliran bicara. Ucapkan 'tolong', 'maaf', dan 'terima kasih' dengan tulus.",
    type: 'split',
    accentColor: '#fb923c', // Orange-400
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop"
  },

  // 7. PENUTUPAN (FOOTER)
  {
    id: 7,
    title: "TERIMA KASIH",
    subtitle: "SESI BERAKHIR • TETAP KEREN",
    content: "Materi selesai, tapi praktik etika berjalan seumur hidup. Jadilah inspirasi positif bagi lingkunganmu.",
    type: 'footer',
    accentColor: '#bef264'
  }
];

export const ICONS = {
  Zap,
  Target,
  BarChart3,
  Users,
  Cpu,
  Layers,
  MessageSquare,
  ArrowRight,
  Heart,
  Shield,
  Star,
  Smile,
  Cloud,
  Sparkles,
  Flower2,
  Music,
  Hash,
  Globe
};

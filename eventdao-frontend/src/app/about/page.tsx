'use client';

import React from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function AboutPage() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
                EventDAO
              </Link>
              <span className="ml-2 text-sm text-gray-500">Proof of Event on Solana</span>
            </div>
            <div className="flex items-center gap-4">
              {!connected && <WalletMultiButton />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Intro Hook */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            EventDAO – Proof of Event on Solana
          </h1>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg mb-8">
            <p className="text-xl text-gray-700 italic leading-relaxed">
              &ldquo;Bayangkan dunia di mana setiap konser, seminar, atau pertandingan olahraga yang Anda hadiri 
              dapat diverifikasi on-chain. Tidak ada tiket palsu. Tidak ada klaim yang tidak dapat diverifikasi. 
              Hanya bukti kehadiran yang transparan dan dapat dikoleksi.&rdquo;
            </p>
          </div>
        </section>

        {/* Problem */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Masalah Saat Ini</h2>
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                Event saat ini sulit untuk diverifikasi
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                Tiket palsu, kehadiran manual, klaim yang tidak dapat diverifikasi
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                Orang ingin bukti digital yang dapat dipercaya dan dikoleksi
              </li>
            </ul>
          </div>
        </section>

        {/* Solution */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Solusi EventDAO</h2>
          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded mb-6">
            <p className="text-lg text-gray-700 mb-4">
              <strong>EventDAO</strong> = Platform berbasis Solana untuk verifikasi event
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                Pengguna mengirim klaim event (contoh: &apos;Coldplay Jakarta, 15 Nov 2025, terjadi&apos;)
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                Orang lain stake jumlah kecil (0.01–0.1 SOL) untuk atau melawan
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                Resolusi melalui API, feed berita, atau oracle
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                Pemenang mendapat reward
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                Peserta mint NFT Proof of Attendance yang unik
              </li>
            </ul>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Fitur Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Event Verification Market</h3>
              <p className="text-blue-700">Pasar verifikasi event yang transparan dan terdesentralisasi</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-3">NFT Attendance (POAPs)</h3>
              <p className="text-green-700">Mint NFT sebagai bukti kehadiran yang dapat dikoleksi</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Gamification</h3>
              <p className="text-purple-700">Leaderboard, badge, dan sistem reward yang menarik</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-orange-900 mb-3">Community DAO</h3>
              <p className="text-orange-700">Komunitas DAO untuk kurasi dan moderasi event</p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Keuntungan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Verifikasi Mudah</h4>
                  <p className="text-gray-600">Melalui API resmi dan oracle terpercaya</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Menyenangkan & Ringan</h4>
                  <p className="text-gray-600">Tidak sensitif secara politik atau hoax</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Use Case Global</h4>
                  <p className="text-gray-600">Konser, olahraga, konferensi di seluruh dunia</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">User-Friendly</h4>
                  <p className="text-gray-600">NFT sebagai tiket digital yang mudah digunakan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Solana */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Mengapa Solana?</h2>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Metaplex untuk NFTs</h4>
                <p className="text-gray-600">Standar NFT yang terintegrasi dengan baik</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Pyth Oracles</h4>
                <p className="text-gray-600">Verifikasi data real-time yang akurat</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Solana Pay</h4>
                <p className="text-gray-600">Sistem pembayaran yang efisien</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Biaya Rendah</h4>
                <p className="text-gray-600">Sempurna untuk adopsi massal</p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Roadmap</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-400 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">MVP (Hackathon)</h4>
              <p className="text-gray-600">Submit klaim, stake, resolve, reward, NFT attendance</p>
            </div>
            <div className="border-l-4 border-green-400 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Ekspansi</h4>
              <p className="text-gray-600">Partner dengan event organizer, tambahkan leaderboard</p>
            </div>
            <div className="border-l-4 border-purple-400 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Global Scaling</h4>
              <p className="text-gray-600">Standar untuk NFT ticketing & proof of event</p>
            </div>
          </div>
        </section>

        {/* Hackathon Pitch */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Hackathon Pitch</h2>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
            <blockquote className="text-xl italic leading-relaxed">
              &ldquo;EventDAO adalah pasar kebenaran untuk event dunia nyata. 
              Klaim diverifikasi secara otomatis, peserta mendapat NFT proof of attendance, 
              dan semuanya transparan di Solana. Dari Coldplay di Jakarta hingga konferensi global, 
              EventDAO membuat kehadiran Anda dapat diverifikasi dan dikoleksi.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Siap Bergabung dengan EventDAO?
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai verifikasi event dan mint NFT proof of attendance Anda hari ini!
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/" 
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Mulai Sekarang
              </Link>
              {!connected && <WalletMultiButton />}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

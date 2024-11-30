"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useLiff } from './hooks/useLiff';

export default function Home() {
  const liffId = '2006623415-73B9n0a3'; // LINE Developersで取得したLIFF ID
  const { liff, error } = useLiff(liffId);
  const [userData, setUserData] = useState({
    age: '',
    height: '',
    weight: '',
    line_id: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true); // ローディング状態
  const [profile, setProfile] = useState(null);

  // LINEユーザーIDの取得
  useEffect(() => {
    const fetchLineUserId = async () => {
      if (liff && liff.isLoggedIn()) {
        try {
          const profileData = await liff.getProfile();
          setProfile(profileData); // プロフィール情報を設定
          setUserData((prevData) => ({ ...prevData, line_id: profileData.userId }));
        } catch (err) {
          console.error('Error fetching LINE user ID:', err);
        } finally {
          setLoading(false); // ローディング終了
        }
      } else {
        // 未ログインの場合はログインを要求
        try {
          liff.login();
        } catch (err) {
          console.error('Error logging in:', err);
        }
      }
    };
    if (liff) {
      fetchLineUserId();
    }
  }, [liff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      setStatusMessage(data.message);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatusMessage('Error submitting data');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* ヘッダー */}
      <header>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="#" className="flex items-center">
              <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Health with Cat
              </span>
            </a>
          </div>
        </nav>
      </header>
  
      {/* メインコンテンツ */}
      <main className="">
        {/* <div>
          {profile && (
            <div>
              <p>Display Name: {profile.displayName}</p>
              <p>LINE ID: {profile.userId}</p>
              {profile.pictureUrl && <img src={profile.pictureUrl} alt="Profile" />}
            </div>
          )}
        </div> */}
        <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="max-w-sm px-4 ">
          {/* 年齢入力 */}
          <div className="mb-5">
            <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              年齢
            </label>
            <input
              type="text"
              id="age"
              name="age"
              value={userData.age}
              onChange={handleChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="歳"
              required
            />
          </div>
  
          {/* 身長入力 */}
          <div className="mb-5">
            <label htmlFor="height" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              身長
            </label>
            <input
              type="text"
              id="height"
              name="height"
              value={userData.height}
              onChange={handleChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="cm"
              required
            />
          </div>
  
          {/* 体重入力 */}
          <div className="mb-5">
            <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              体重
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={userData.weight}
              onChange={handleChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="kg"
              required
            />
          </div>
  
          {/* 保存ボタン */}
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            保存
          </button>
        </form>
        </div>
      </main>
      {/* ステータスメッセージ */}
      {statusMessage && (
        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          {statusMessage}
        </p>
      )}
      {/* フッター */}
      <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-xs text-gray-500 sm:text-center dark:text-gray-400">
            © 2024 <a href="https://flowbite.com/" className="hover:underline">女性の健康向上システム</a>. All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
}

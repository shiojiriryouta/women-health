"use client";

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
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // フォーム送信状態

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
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        setIsFormSubmitted(true); // フォーム送信完了状態にする
        setStatusMessage('フォームが正常に送信されました！');
      } else {
        const errorData = await response.json();
        setStatusMessage(errorData.message || 'データ送信中にエラーが発生しました');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatusMessage('データ送信中にエラーが発生しました');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <main>
        <div className="flex justify-center">
          {/* フォーム表示を制御 */}
          {!isFormSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-sm px-4">
              <div className="mb-5">
                <label htmlFor="age" className="block mb-2 text-sm font-medium">
                  年齢
                </label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={userData.age}
                  onChange={handleChange}
                  className="block w-full p-2.5"
                  placeholder="歳"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="height" className="block mb-2 text-sm font-medium">
                  身長
                </label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  value={userData.height}
                  onChange={handleChange}
                  className="block w-full p-2.5"
                  placeholder="cm"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="weight" className="block mb-2 text-sm font-medium">
                  体重
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={userData.weight}
                  onChange={handleChange}
                  className="block w-full p-2.5"
                  placeholder="kg"
                  required
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 px-5 py-2.5"
              >
                保存
              </button>
            </form>
          ) : (
            <div className="text-center">
              <h1 className="text-xl font-bold">送信が完了しました！</h1>
              <p className="mt-4 text-sm text-gray-500">{statusMessage}</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

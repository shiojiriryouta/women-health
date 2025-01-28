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
  
  // 現在のアクティブなタブの状態
  const [activeTab, setActiveTab] = useState(0);
  
  // 生体情報の更新State
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // 食事・運動履歴の編集用State
  const [date, setDate] = useState('');
  const [meal, setMeal] = useState('');
  const [note, setNote] = useState('');
  const [edited, setEdited] = useState(false);

  // リマインド機能のオンオフ用のState
  const [isToggled, setIsToggled] = useState("");
  const handleToggle = () => {
    setIsToggled((prev) => !prev);
  };
  const [rimind, setRimind] = useState(false);

  useEffect(() => {
    const fetchLineUserId = async () => {
      if (liff && liff.isLoggedIn()) {
        try {
          const profileData = await liff.getProfile();
          setProfile(profileData);
          setUserData((prevData) => ({ ...prevData, line_id: profileData.userId }));
        } catch (err) {
          console.error('Error fetching LINE user ID:', err);
        } finally {
          setLoading(false);
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
      const response = await fetch('api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        setIsFormSubmitted(true);
        setStatusMessage('フォームの送信が完了しました！');
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


  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const profileData = await liff.getProfile();
    const mealData = {
      line_id: profileData.userId,  // ユーザーのLINE ID（適宜取得）
      date,     // 選択された日付
      mealType: meal, // 選択された食事時間（"breakfast", "lunch", "dinner"）
      mealData: note  // ユーザーが入力した食事内容
    };
  
    try {
      const response = await fetch('/api/meal_edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mealData),
      });
  
      if (response.ok) {
        setEdited(true)
        setStatusMessage('食事内容の更新が完了しました！');
      } else {
        const errorData = await response.json();
        setStatusMessage(errorData.message || 'データ送信中にエラーが発生しました');
      }
    } catch (error) {
      console.error('Error updating meal data:', error);
      setStatusMessage('データ送信中にエラーが発生しました');
    }
  };
  const handleSubmitRemind = async (e) => {
    e.preventDefault();
    const profileData = await liff.getProfile();
    const remindData = {
      line_id: profileData.userId,  // ユーザーのLINE ID（適宜取得）
      remindData: isToggled  // ユーザーが入力した食事内容
    };
  
    try {
      const response = await fetch('/api/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(remindData),
      });
  
      if (response.ok) {
        setRimind(true)
        setStatusMessage('食事内容の更新が完了しました！');
      } else {
        const errorData = await response.json();
        setStatusMessage(errorData.message || 'データ送信中にエラーが発生しました');
      }
    } catch (error) {
      console.error('Error updating meal data:', error);
      setStatusMessage('データ送信中にエラーが発生しました');
    }
  };
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const minDate = new Date("2024-11-24");
    const maxDate = new Date();
  
    if (selectedDate < minDate || selectedDate > maxDate) {
      alert("選択可能な日付の範囲を超えています");
      e.target.value = ""; // 不正な入力をリセット
    } else {
      setDate(e.target.value);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
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

      <div className="flex justify-center mt-4 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 0 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab(0)}
        >
          生体情報
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 1 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab(1)}
        >
          履歴編集
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 2 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab(2)}
        >
          リマインド設定
        </button>
      </div>


      {/* メインコンテンツ */}
      <main className="mt-4">

        {/* 生体情報更新 */}
        {activeTab === 0 && (
          <div className="flex justify-center">
            {!isFormSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-sm px-4">
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

                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  保存
                </button>
              </form>
            ) : (
              <div className="text-center">
                <h1 className="text-xl font-bold">情報登録を完了しました！</h1>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{statusMessage}</p>
              </div>
            )}
          </div>
        )}



        {/* 情報更新 */}
        {activeTab === 1 && (
          <div>
            <div className="mx-auto flex justify-center">
            {!edited ? (
              <form onSubmit={handleSubmitEdit} className="space-y-4">
                {/* 日付選択 */}
                <div>
                  <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">日付</label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={handleDateChange} // カスタムバリデーション関数を使用
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    required
                  />

                </div>

                {/* 朝昼晩の選択 */}
                <div>
                  <label htmlFor="meal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">時間帯</label>
                  <select
                    id="meal"
                    value={meal}
                    onChange={(e) => setMeal(e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="breakfast">朝食</option>
                    <option value="lunch">昼食</option>
                    <option value="dinner">夕食</option>
                  </select>
                </div>

                {/* めしの内容 */}
                <div>
                  <label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">食事内容</label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    rows="1"
                    placeholder="例：サバ定食"
                    required
                  ></textarea>
                </div>

                {/* 送信ボタン */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    保存
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <h1 className="text-xl font-bold">食事の履歴を編集しました！</h1>
              </div>
            )}
            </div>
          </div>
        )}


        {/* リマインダー */}
        {activeTab === 2 && (
          <div className="flex flex-col items-center min-h-screen">
            {!rimind ? (
              <form onSubmit={handleSubmitRemind} className="max-w-sm px-4">
                {/* 朝昼晩の選択 */}
                <div className="mb-5">
                  <label htmlFor="meal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    食事のリマインド通知
                  </label>
                  <select
                    id="meal"
                    value={isToggled}
                    onChange={(e) => setIsToggled(e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="1">ON</option>
                    <option value="0">OFF</option>
                  </select>
                </div>
      
                {/* 送信ボタン */}
                <div>
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    保存
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <h1 className="text-xl font-bold">リマインダー設定を更新しました！</h1>
              </div>
            )}
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-xs text-gray-500 sm:text-center dark:text-gray-400">
            © 2025 <a href="https://flowbite.com/" className="hover:underline">Health with Cat</a>. All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

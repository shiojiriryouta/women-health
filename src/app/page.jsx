import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <header>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="#" className="flex items-center">
              <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Health with Cat</span>
            </a>
          </div>
        </nav>
      </header>
      <main className="flex justify-center">
        <form className="max-w-sm px-4">
          <div className="mb-5">
            <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">年齢</label>
            <input type="text" id="age" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="歳" required />
          </div>
          <div className="mb-5">
            <label htmlFor="length" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">身長</label>
            <input type="text" id="length" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="cm" required />
          </div>
          <div className="mb-5">
            <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">体重</label>
            <input type="text" id="weight" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="kg" required />
          </div>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">保存</button>
        </form>
      </main>
      

      <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-xs text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://flowbite.com/" className="hover:underline">女性の健康向上システム</a>. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}

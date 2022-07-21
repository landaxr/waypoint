const LoadingScreen = ({
  loadingProgress,
  title,
}: {
  loadingProgress: number;
  title: string;
}) => {
  const pct = 100 * loadingProgress;

  const pctString = `${pct.toFixed(2)}%`;

  return (
    <div className="w-screen h-screen flex place-items-center justify-center border-black border-2">
      <div className="w-7/12 self-center">
        <div className="mb-1 p-2 justify-center text-center">
          <span className="font-mono font-medium text-red dark:text-white">
            {title}
          </span>
        </div>
        <div className="bg-red-light animate-pulse rounded-full h-5 dark:bg-gray-700">
          <div
            className="bg-red h-5 rounded-full"
            style={{ width: pctString }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

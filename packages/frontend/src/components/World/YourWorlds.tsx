import MainNavbar from "../Nav/MainNavbar";

const Drafts = () => {
  // const { loading, error, data } = useQuery<WorldsData>(GET_LOCAL_WORLDS);

  return null;
};

const YourWorlds = () => {
  return (
    <>
      <MainNavbar />
      <div className="container mx-auto flex items-center">
        <Drafts />
      </div>
    </>
  );
};

export default YourWorlds;

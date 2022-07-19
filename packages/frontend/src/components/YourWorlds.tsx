import { useQuery, gql, useMutation } from "@apollo/client";
import { useCallback } from "react";
// import {
//   GET_LOCAL_WORLDS,
//   WorldsData,
//   ADD_WORLD,
//   addWorld,
// } from "../editorDb/localDb";
import { Link } from "react-router-dom";

const Drafts = () => {
  // const { loading, error, data } = useQuery<WorldsData>(GET_LOCAL_WORLDS);

  return null;
};

const CreateWorldButton = () => {
  // const [addWorld, { data, loading, error }] = useMutation<
  //   {
  //     name: string;
  //   },
  //   {
  //     name: string;
  //   }
  // >(ADD_WORLD, {
  //   update(cache, { data }) {
  //     debugger;
  //     if (!data) return;

  //     cache.modify({
  //       fields: {
  //         worlds(existingWorlds = []) {
  //           const newWorldRef = cache.writeFragment({
  //             data,
  //             fragment: gql`
  //               fragment NewWorld on World {
  //                 id
  //                 name
  //               }
  //             `,
  //           });
  //           return [...existingWorlds, newWorldRef];
  //         },
  //       },
  //     });
  //   },
  // });

  // const worlds = useQuery<WorldsData>(GET_LOCAL_WORLDS);

  // const handleCreateWorldClick = useCallback(async () => {
  //   addWorld("crut");
  //   alert("World Created");
  // }, [addWorld]);

  // if (loading) return <>Submitting...</>;
  // if (error) return <>`Submission error! ${error.message}`</>;

  return (
    <>
      <Link
        className="m-auto p-4 rounded-full bg-green-600 text-white text-md font-medium hover:bg-green-900 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
        to="/worlds/new"
      >
        Create a World
      </Link>
      <ul>
        {/* {worlds.data?.worlds.map((world) => (
          <li>{world.name}</li>
        ))} */}
      </ul>
    </>
  );
};

const YourWorlds = () => {
  return (
    <div className="container mx-auto flex items-center">
      <CreateWorldButton />
      <Drafts />
    </div>
  );
};

export default YourWorlds;

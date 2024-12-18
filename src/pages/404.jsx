import { Link, useRouteError } from "react-router-dom";

import "../index.css";
import { Button } from "@material-tailwind/react";

export default function Page404() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <main className="grid h-screen place-items-center bg-white sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-2xl font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/dashboard"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Button>Go back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

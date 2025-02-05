import { Button } from "antd";
import { Link } from "react-router-dom";
import Error from "../assets/icons/Error";
export default function ErrorPage() {
  return (
    <div id="error-page">
      <main className="flex justify-center items-center flex-col min-h-full place-items-center bg-white px-6 py-10">
        <Error className="w-20 h-20" />

        <div className="text-center">
          <p className="text-4xl font-semibold text-primary">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button>
              <Link to={"/"}>Go back home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

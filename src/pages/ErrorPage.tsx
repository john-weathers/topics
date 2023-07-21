import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    if (isRouteErrorResponse(error)) {
      return (
        <div className='center'>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
              <i>{error.statusText}</i>
            </p>
        </div>
      );
    } else if (error instanceof Error) {
      return (
        <div className='center'>
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occured</p>
          <p>
            <i>{error.message}</i>
          </p>
        </div>
      )
    } else {
      return (
        <div className='center'>
          <h1>Oops! Something went wrong!</h1>
        </div>
      )
    }
    
}
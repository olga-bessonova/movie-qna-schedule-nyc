function formatDate(dateSpring) {
  const date = new Date(dateSpring);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

export default function AMCMovieCard({ movie }) {
  return (
    <div className="keen-slider__slide flex justify-center min-w-[250px] max-w-[500px]">
      <div className="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col max-h-[480px]">
        <img
          src={movie.image_url}
          alt={movie.title}
          className="h-50 w-full object-cover"
        />
        <div className="p-4 flex flex-col flex-grow justify-center text-center select-text">
          <h2 className="text-lg font-bold text-gray-900">{movie.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {movie.runtime} | {movie.rating}
          </p>
          <p className="text-sm text-gray-400 m-1">{formatDate(movie.date)}</p>
          <a
            href={movie.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700 transition"
          >
            Get Tickets
          </a>
        </div>
      </div>
    </div>
  );
}
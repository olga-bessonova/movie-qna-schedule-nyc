export default function About() {
    return (
      <div className="max-w-3xl mx-auto p-8 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">About Q&A Movie Calendar</h1>
  
        <p className="mb-4">
          Q&A Movie Calendar is a free tool that helps New York moviegoers find
          upcoming screenings with filmmaker Q&As at AMC and IFC theaters.
        </p>
  
        <p className="mb-4">
          The site automatically updates every day by collecting showtime
          information from AMC and IFC websites. Only upcoming movies are
          displayed.
        </p>
  
        <p className="mb-4 font-semibold text-red-600">
          This site is not affiliated with AMC Theatres or IFC Center. Please
          confirm tickets and showtimes on official sites before attending.
        </p>
  
        <h2 className="text-2xl font-bold mt-6 mb-2">About the Developer</h2>
        <p className="mb-4">
          Developed by <strong>Olga Bessonova</strong>, a software engineer and
          data scientist passionate about film, technology, and building useful
          tools for communities.
        </p>
  
        <div className="flex space-x-4">
          <a href="https://github.com/olga-bessonova" target="_blank" className="text-gray-600 hover:text-black">GitHub</a>
          <a href="https://olgabessonova.com/" target="_blank" className="text-gray-600 hover:text-black">Website</a>
          <a href="https://www.linkedin.com/in/olgabessonova-/" target="_blank" className="text-gray-600 hover:text-black">LinkedIn</a>
        </div>
      </div>
    );
  }
  
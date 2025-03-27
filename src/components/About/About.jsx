import React from "react";
import "./About.css"; // Можно добавить стили в отдельный файл

function About() {
  return (
    <div className="about-container">
      <p>
        In this project created during self-initiated course under mentorship of
        Milo Keller at ECAL, I collaborated with AI to examine what personal
        archives can preserve beyond the purely individual and how they might
        interpret the modern world through the lens of archival imagery. The
        installation features 5 screens each representing an image sequence
        built on excerpts from personal photographic archives of contributors.
        <br />
        <br />
        By building multiple custom image-generative models trained on submitted
        archives of four participants and myself, I speculated on personal
        events and pressing social issues, intentionally blurring the line
        between the real and the hypothetical. With prompts covering life’s
        stages—from childhood and relationships to society, politics, and
        beyond—the resulting sequences offer familiar but powerfully challenging
        visions of human experience. Popular AI often avoids controversial or
        triggering visuals, but integrating personal archives uncovers what is
        typically hidden, creating compelling contrasts where digital “glitches”
        signal moments of controversy both for the algorithms and for us.
        <br />
        <br />
        These glitches become even more telling when the models, shaped by
        relatively moderated imagery, encounter content that is raw, unfiltered,
        and difficult to lable. They expose not just technical shortcomings but
        also the social and emotional blind spots of our increasingly AI-driven
        world—like when a prompt referencing intimacy or sexuality yields
        fractured, formless bodies. Taken individually or in comparison, each
        sequence sparks a dialogue on how we recount our past and engage with
        current realities. Ultimately, the project suggests that the true
        potency of AI technologies applied to archives lies not in seamless
        mimicking of reality, but in its ability to illuminate hidden layers of
        our personal and collective histories.
      </p>

      {/* Изображение с отступом */}
      <div className="about-image-container">
        <img
          className="about-image"
          src={`${process.env.PUBLIC_URL}/images/about.jpg`}
        />
        <p className="image-caption">
          5-channel video installation displayed on five screens, each mounted
          on identical tripods
        </p>
      </div>

      <p>
        Andrey Lopatin is a Russian-born artist currently based in Lausanne,
        where he is pursuing a Master’s degree in Photography at ECAL. He holds
        a Bachelor’s degree in Cultural Studies from HSE in Moscow, where he
        first became captivated by the interplay between visual media and
        emerging technologies—an interest that evolved to encompass artificial
        and other non-human intelligences, digital capitalism, and human
        responses to technological innovation. Grounded in active
        experimentation with cutting-edge tools, his practice explores the
        social and personal reverberations such technologies produce, shedding
        light on the ever-evolving terrain between human agency and
        machine-driven processes.
      </p>

      <p>
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        {/* Thanks to: <br />
        _ <br />
        Thomas Livugu Ngolyo <br />
        Daniel Hernandez Ferrer <br />
        Brighton <br />
        Antonica <br />
        Fernando <br />
        Ken ken <br />
        bereket <br />
        Zara <br />
        Pat Springer <br />
        trantuan <br />
        Javier Rengel <br />
        Ken ADAMU UWESU MBINDIMBI Franco Sherwin Ana Q. Isaiah owino Mara Sousa
        Elonjustin254 Unju Knetts VINCENT MissKambua Sir. Stephen Kago Nikolina
        Nuno Nascimento Alvin stephen gicheha Deva Steve the Builder Asia
        Kryvenko ansahmbom Betrand loah Hazzin Manali Sammy Kigen Wickliffe
        Nigel Vipul Nagaar bluei reza/smarmendem _ …and 22 anonymous contributor */}
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        _ <br />
        <br />
        for more @streeterror
        <br />© Ècole cantonale d’art de Lausanne & Andrey Lopatin
      </p>
    </div>
  );
}

export default About;

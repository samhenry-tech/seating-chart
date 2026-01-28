export const TestingPage = () => {
  const panX = 10;
  const panY = 10;

  return (
    <section
      className="relative resize border border-red-400"
      style={{ width: 100, height: 100, overflow: "hidden", resize: "both" }}
    >
      <div className="absolute top-1/2 z-50 h-px w-full -translate-y-1/2 bg-blue-300" />
      <div className="absolute left-1/2 z-50 h-full w-px -translate-x-1/2 bg-blue-300" />
      <article
        className="absolute"
        style={{
          width: 400,
          height: 400,
          top: `calc(50% + ${panY}px)`,
          left: `calc(50% - ${panX}px)`,
          transform: "translate(-50%, -50%)",
          backgroundImage:
            'url("https://img.freepik.com/premium-vector/square-pattern-black-white-crossing-lines-vector-seamless-repeatable-grid-texture_1418797-862.jpg?semt=ais_hybrid&w=740&q=80")',
          backgroundSize: "100px 100px",
        }}
      >
        <div className="absolute top-1/2 left-1/2 z-200 h-px w-px -translate-1/2 bg-fuchsia-500" />
      </article>
    </section>
  );
};

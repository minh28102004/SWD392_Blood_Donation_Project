import { useState } from "react";
function RequestColumn({ status, data }) {
  const [detailId, setDetailId] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [filtered, setFiltered] = useState([]);

  const filtered_data = data.filter((detail) => {
    if (detail.Status == status) return true;
    return false;
  });
  const handleSearch = () => {
    const found = requests.filter((req) => req.id === parseInt(searchId));
    setFiltered(found);
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2 mb-4">
        {/* <input placeholder="Search" title="Search" /> */}
        <input
          type="number"
          placeholder="Search by ID..."
          className="border p-2 rounded w-full"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Search
        </button>
      </div>
      {filtered_data.map((entry) => {
        return (
          <div
            key={entry.ID}
            className="border border-black p-4 rounded-xl w-full text-sm"
          >
            <div className="flex justify-between">
              <button>❌</button>
              <button></button>
            </div>
            <p>
              <strong>ID:</strong>
              {entry.ID}
            </p>
            {detailId == entry.ID && (
              <div>
                <p>Date:{entry.Date}</p>
                <p>From:{entry.From}</p>
                <p>To:{entry.To}</p>
                <p>BloodType:{entry.BloodType}</p>
                <p>Quantity:{entry.Quantity}</p>
                <textarea value={entry.Note} readOnly />
              </div>
            )}
            <p>Status:{entry.Status} </p>
            <button
              onClick={() => {
                setDetailId(entry.ID);
              }}
              hidden={detailId == entry.ID}
              className="text-xs"
            >
              See more
            </button>
            <button
              onClick={() => {
                setDetailId(null);
              }}
              hidden={detailId != entry.ID}
              className="text-xs"
            >
              See less
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default RequestColumn;

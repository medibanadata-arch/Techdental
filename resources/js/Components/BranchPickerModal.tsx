import React from "react";
import { X, MapPin, Navigation, Compass, Star } from "lucide-react";

interface BranchPickerModalProps {
  locations?: any[];
  isOpen: boolean;
  onClose: () => void;
  actionType: "directions" | "reviews";
}

const DEFAULT_LOCATIONS = [
  {
    id: 1,
    name: "Mirpur Branch",
    address: "827 (2nd Floor), Shewrapara, Begum Rokeya Sarani, Mirpur, Dhaka-1216",
    map_url: "https://maps.google.com/?q=Tech+Dental+Shewrapara+Mirpur+Dhaka",
    review_url: "https://search.google.com/local/writereview?placeid=ChIJTechDentalMirpur",
  },
  {
    id: 2,
    name: "Uttara Branch",
    address: "House 18, Road 14, Sector 3, Uttara, Dhaka",
    map_url: "https://maps.google.com/?q=Tech+Dental+Sector+3+Uttara+Dhaka",
    review_url: "https://search.google.com/local/writereview?placeid=ChIJTechDentalUttara",
  },
  {
    id: 3,
    name: "Badda Branch",
    address: "Cha-68/1, Pragati Sarani, Middle Badda, Dhaka",
    map_url: "https://maps.google.com/?q=Tech+Dental+Middle+Badda+Dhaka",
    review_url: "https://search.google.com/local/writereview?placeid=ChIJTechDentalBadda",
  },
  {
    id: 4,
    name: "Jatrabari Branch",
    address: "Shahid Faruk Road, South Jatrabari, Dhaka",
    map_url: "https://maps.google.com/?q=Tech+Dental+Jatrabari+Dhaka",
    review_url: "https://search.google.com/local/writereview?placeid=ChIJTechDentalJatrabari",
  },
];

export const BranchPickerModal: React.FC<BranchPickerModalProps> = ({
  locations,
  isOpen,
  onClose,
  actionType,
}) => {
  if (!isOpen) return null;

  const isDirections = actionType === "directions";
  const displayLocations = (locations && locations.length > 0) ? locations : DEFAULT_LOCATIONS;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in transition-opacity"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white w-full max-w-[460px] rounded-[24px] p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all border border-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
              isDirections ? 'bg-blue-50 text-blue-600 ring-4 ring-blue-50/50' : 'bg-rose-50 text-[#8B1038] ring-4 ring-rose-50/50'
            }`}>
              {isDirections ? (
                <Compass className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <Star className="w-5 h-5 fill-current" />
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-[17px] font-black text-slate-900 leading-tight">
                {isDirections ? "Google Maps Directions" : "Google Reviews"}
              </h3>
              <p className="text-[12px] text-slate-500 mt-0.5 font-medium">
                {isDirections
                  ? "Select a branch to get directions:"
                  : "Select a branch to view reviews:"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Branch List Cards */}
        <div className="space-y-2.5 mt-4">
          {displayLocations.map((branch: any) => {
            const rawMapUrl = branch.map_url || branch.mapUrl;
            const targetUrl = isDirections
              ? (rawMapUrl && rawMapUrl.startsWith("http")
                  ? rawMapUrl
                  : `https://maps.google.com/?q=${encodeURIComponent('Tech Dental ' + branch.name)}`)
              : (branch.review_url || branch.reviewUrl || "https://maps.google.com");

            return (
              <a
                key={branch.id || branch.location_id || branch.name}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-white hover:shadow-md transition-all duration-200 no-underline text-inherit cursor-pointer"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0"></span>
                    <h4 className="text-[14.5px] sm:text-[15.5px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {branch.name}
                    </h4>
                  </div>
                  {branch.address && (
                    <p className="text-[11.5px] sm:text-xs text-slate-500 mt-1 flex items-start gap-1 leading-snug">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0 mt-0.5 transition-colors" />
                      <span className="line-clamp-1">{branch.address}</span>
                    </p>
                  )}
                </div>

                {/* Styled Action Button */}
                <div className="shrink-0">
                  {isDirections ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1a73e8] to-[#1557b0] group-hover:from-[#1557b0] group-hover:to-[#0d47a1] text-white font-bold text-[12.5px] sm:text-[13px] shadow-[0_2px_8px_rgba(26,115,232,0.35)] group-hover:shadow-[0_4px_14px_rgba(26,115,232,0.48)] group-hover:scale-[1.03] active:scale-95 transition-all duration-200">
                      <Navigation className="w-3.5 h-3.5 fill-white text-white rotate-45 shrink-0" />
                      <span className="tracking-tight">Directions</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1038] to-[#6E0C2C] text-white font-bold text-[12.5px] sm:text-[13px] shadow-[0_2px_8px_rgba(139,16,56,0.35)] group-hover:scale-[1.03] active:scale-95 transition-all duration-200">
                      <Star className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span>View Reviews</span>
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

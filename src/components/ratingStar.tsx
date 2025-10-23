import { FullStarIcon } from "@/icons/page";
import React from "react";

interface RatingStarProps {
  rating: number; // The current rating value (e.g., 4)
  maxRating?: number; // The maximum rating (default is 5)
  //   onRatingChange?: (rating: number) => void; // Callback function for when the rating changes
}

const RatingStar: React.FC<RatingStarProps> = ({ rating, maxRating = 5 }) => {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => (
        <div key={index}>
          <FullStarIcon size={12} className="text-neon_pink" />
        </div>
      ))}
    </div>
  );
};

export default RatingStar;

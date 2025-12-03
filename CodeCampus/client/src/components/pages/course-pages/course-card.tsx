import React from "react";
import {
  Rating
} from "@material-tailwind/react";
import { formatToINR } from "../../../utils/helpers";
import { CourseInterface } from "../../../types/course";

const CourseCard:React.FC<CourseInterface> = ({rating,price,isPaid,title,thumbnailUrl,description}) => {
  // Safely validate and normalize rating value
  const safeRating = React.useMemo(() => {
    try {
      // Handle null, undefined, or non-number values
      if (rating === null || rating === undefined) {
        return 0;
      }
      
      // Convert to number if it's a string
      const numRating = typeof rating === 'string' ? parseFloat(rating) : Number(rating);
      
      // Validate it's a valid number within range
      if (
        typeof numRating === 'number' && 
        !isNaN(numRating) && 
        isFinite(numRating) &&
        numRating >= 0 && 
        numRating <= 5
      ) {
        // Ensure it's a safe integer for array operations - clamp between 0 and 5
        const clamped = Math.max(0, Math.min(5, numRating));
        // Round to 1 decimal to avoid floating point issues
        return Math.round(clamped * 10) / 10;
      }
      
      return 0;
    } catch (error) {
      console.error("Error validating rating:", error);
      return 0;
    }
  }, [rating]);

  return (
    <div className="w-[18.5rem] p-5 text-customTextColor  hover:shadow-md hover:border hover:border-gray-300">
      <div className="relative">
        <img src={thumbnailUrl || "https://via.placeholder.com/300x200"} className="h-1/2" alt="ui/ux review check" />
        <div className="absolute inset-0 h-[10rem] bg-gradient-to-tr from-transparent via-transparent to-black/60" />
      </div>
      <div className="pt-4">   
        <div className="mb-3">
          <h5 className="text-blue-gray text-xl font-medium">{title || "Course Title"}</h5>
        </div>
        <p className="text-gray text-sm line-clamp-1">{description || ""}</p>
        <div className="mt-4 flex justify-between items-center">
          <div className="group">
          <p className={`text-sm font-normal ${isPaid ? "text-blue-gray" : "text-white p-1 text-xs rounded-tl-lg rounded-br-lg  font-extrabold bg-green-400"}`}>
              {isPaid ? formatToINR(price || 0) : "Free"}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {(() => {
              try {
                // Double-check rating is valid before rendering Rating component
                // Rating component expects an integer between 1 and 5
                if (safeRating > 0 && safeRating <= 5 && !isNaN(safeRating) && isFinite(safeRating)) {
                  // Convert to integer between 1-5 for Rating component (it creates array internally)
                  const ratingInt = Math.max(1, Math.min(5, Math.round(safeRating)));
                  
                  // Additional safety check - ensure it's a valid integer
                  if (Number.isInteger(ratingInt) && ratingInt >= 1 && ratingInt <= 5) {
                    return (
                      <>
                        <Rating value={ratingInt} readonly />
                        <p className="text-blue-gray text-sm font-normal">{safeRating.toFixed(1)}</p>
                      </>
                    );
                  }
                }
                return <p className="text-blue-gray text-sm font-normal">No rating</p>;
              } catch (error) {
                console.error("Error rendering rating:", error);
                return <p className="text-blue-gray text-sm font-normal">No rating</p>;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

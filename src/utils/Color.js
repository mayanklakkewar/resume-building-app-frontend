const uploadResumeImages = async () => {
  try {
    setIsLoading(true);

    const thumbnailElement = thumbnailRef.current;
    if (!thumbnailElement) {
      throw new Error("Thumbnail element not found");
    }

    const fixedThumbnail = fixTailwindColors(thumbnailElement);

    const thumbnailCanvas = await html2canvas(fixedThumbnail, {
      scale: 0.5,
      backgroundColor: "#FFFFFF",
      logging: false,
    });

    document.body.removeChild(fixedThumbnail);

    const thumbnailDataUrl = thumbnailCanvas.toDataURL("image/png");
    const thumbnailFile = dataURLtoFile(
      thumbnailDataUrl,
      `thumbnail-${resumeId}.png`
    );

    const formData = new FormData();
    formData.append("thumbnail", thumbnailFile);

    const uploadResponse = await axiosInstance.put(
      API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const { thumbnailLink } = uploadResponse.data;
    await updateResumeDetails(thumbnailLink);

    toast.success("Resume Updated Successfully");
    navigate("/dashboard");
  } catch (error) {
    console.error("Error Uploading Images:", error);
    toast.error("Failed to upload images");
  } finally {
    setIsLoading(false);
  }
};

// src/utils/colors.js
export const fixTailwindColors = (element) => {
  const clone = element.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.width = `${element.offsetWidth}px`;
  document.body.appendChild(clone);

  // Convert oklch colors to rgb
  const convertOklch = (value) => {
    const oklchRegex = /oklch\(([^)]+)\)/g;
    return value.replace(oklchRegex, (match) => {
      // For production, replace with actual oklch to rgb conversion logic
      // This is a placeholder - in a real app you'd use a color conversion library
      return match.replace("oklch", "rgb");
    });
  };

  // Process all elements
  const allElements = clone.querySelectorAll("*");
  allElements.forEach((el) => {
    const computed = window.getComputedStyle(el);

    // Handle background colors
    if (computed.backgroundColor.includes("oklch")) {
      el.style.backgroundColor = convertOklch(computed.backgroundColor);
    }

    // Handle text colors
    if (computed.color.includes("oklch")) {
      el.style.color = convertOklch(computed.color);
    }

    // Handle border colors
    if (computed.borderColor.includes("oklch")) {
      el.style.borderColor = convertOklch(computed.borderColor);
    }
  });

  return clone;
};

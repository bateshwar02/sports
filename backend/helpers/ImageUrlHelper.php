<?php

function getPlayerImageUrl($image)
{
    if (empty($image)) {
        return null;
    }

    // If database already contains full URL
    if (filter_var($image, FILTER_VALIDATE_URL)) {
        return $image;
    }

    // Only keep filename
    $filename = basename($image);

    return 'https://www.aravmzpsports.online/uploads/players/' . rawurlencode($filename);
}
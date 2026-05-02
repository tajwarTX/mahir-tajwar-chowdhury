#!/bin/bash
MODELS=(
  "src/assets/3d/robotic_arm_opt.glb"
  "src/assets/3d/fpv_racing_drone_opt.glb"
  "src/assets/3d/line_follower_robot_opt.glb"
  "src/assets/3d/rocket_opt.glb"
  "src/assets/3d/RobotLIDAR_opt.glb"
  "src/assets/3d/humanoid_main_opt.glb"
)

echo "Starting gentle optimization (WebP Textures + Draco Compression)..."

for file in "${MODELS[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Compress textures to WebP
    npx -y @gltf-transform/cli@latest webp "$file" temp_webp.glb
    
    # Apply Draco compression
    npx -y @gltf-transform/cli@latest draco temp_webp.glb temp_draco.glb
    
    # Overwrite the original file
    mv temp_draco.glb "$file"
    rm -f temp_webp.glb
    
    echo "Successfully optimized $file!"
  else
    echo "File $file not found, skipping."
  fi
done

echo "Done!"

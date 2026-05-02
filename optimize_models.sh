#!/bin/bash
MODELS=(
  "src/assets/3d/robotic_arm_opt.glb"
  "src/assets/3d/fpv_racing_drone_opt.glb"
  "src/assets/3d/line_follower_robot_opt.glb"
  "src/assets/3d/rocket_opt.glb"
  "src/assets/3d/RobotLIDAR_opt.glb"
  "src/assets/3d/humanoid_main_opt.glb"
)

for file in "${MODELS[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # Run simplify and texture compression
    # Try aggressive simplification to ensure under 200kb
    npx -y @gltf-transform/cli@latest simplify "$file" temp.glb --ratio 0.05 --error 0.01
    
    # Compress textures to WebP
    npx -y @gltf-transform/cli@latest webp temp.glb temp2.glb --slots "*"
    
    # Compress with Draco
    npx -y @gltf-transform/cli@latest draco temp2.glb temp3.glb --method edgebreaker --quantize-position 14
    
    mv temp3.glb "$file"
    rm -f temp.glb temp2.glb
    
    size=$(ls -lh "$file" | awk '{print $5}')
    echo "$file is now $size"
  else
    echo "File $file not found!"
  fi
done

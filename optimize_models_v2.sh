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
    
    # 1. Resize textures to 128x128
    npx -y @gltf-transform/cli@latest resize "$file" temp.glb --width 128 --height 128
    
    # 2. Compress textures to WebP
    npx -y @gltf-transform/cli@latest webp temp.glb temp2.glb --slots "*"
    
    # 3. Aggressive simplify
    npx -y @gltf-transform/cli@latest simplify temp2.glb temp3.glb --ratio 0.01 --error 0.05
    
    # 4. Draco compression
    npx -y @gltf-transform/cli@latest draco temp3.glb temp4.glb --method edgebreaker --quantize-position 12
    
    mv temp4.glb "$file"
    rm -f temp.glb temp2.glb temp3.glb
    
    size=$(ls -lh "$file" | awk '{print $5}')
    echo "$file is now $size"
  else
    echo "File $file not found!"
  fi
done

import os
import subprocess
import argparse

# File paths
version_file_path = 'VERSION'
version_info_ts_path = 'src/versionInfo.ts'

# Function to delete the file if it exists
def delete_file_if_exists(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)

# Function to read the semantic version from the VERSION file
def read_version_from_file(file_path):
    with open(file_path, 'r') as file:
        version_string = file.read().strip()
    return version_string

# Function to get the short git commit hash
def get_git_commit_hash():
    result = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], capture_output=True, text=True, check=True)
    return result.stdout.strip()

# Function to write the version info to the TypeScript file
def write_version_info_ts(file_path, major, minor, patch, commit, build_type):
    content = (
        f"export const VersionInfo = {{\n"
        f"    major: {major},\n"
        f"    minor: {minor},\n"
        f"    patch: {patch},\n"
        f"    commit: \"{commit}\",\n"
        f"    type: \"{build_type}\"\n"
        f"}};\n"
    )
    with open(file_path, 'w') as file:
        file.write(content)

def main():
    parser = argparse.ArgumentParser(description="Update VersionInfo for the build")
    parser.add_argument('--type', required=True, choices=['develop', 'preview', 'release'], help="The type of build")
    args = parser.parse_args()

    # Delete the existing versionInfo.ts file
    delete_file_if_exists(version_info_ts_path)

    # Read the version from the VERSION file
    version_string = read_version_from_file(version_file_path)
    major, minor, patch = map(int, version_string.split('.'))

    # Get the git commit hash
    commit_hash = get_git_commit_hash()

	# Get the build type
    build_type = args.type

    # Write the new versionInfo.ts file
    write_version_info_ts(version_info_ts_path, major, minor, patch, commit_hash, build_type)

if __name__ == "__main__":
    main()
